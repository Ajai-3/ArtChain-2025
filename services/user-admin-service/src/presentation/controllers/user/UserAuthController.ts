import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { tokenService } from "../../service/token.service";
import { config } from "../../../infrastructure/config/env";
import { validateWithZod } from "../../../utils/zodValidator";
import { AUTH_MESSAGES } from "../../../constants/authMessages";
import { RegisterDto } from "../../../domain/dtos/user/RegisterDto";
import { GoogleAuthDto } from "../../../domain/dtos/user/GoogleAuthDto";
import { publishToQueue } from "../../../infrastructure/messaging/rabbitmq";
import { LoginRequestDto } from "../../../domain/dtos/user/LoginRequestDto";
import { StartRegisterDto } from "../../../domain/dtos/user/StartRegisterDto";
import { ResetPasswordDto } from "../../../domain/dtos/user/ResetPasswordDto";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { ChangePasswordDto } from "../../../domain/dtos/user/ChangePasswordDto";
import { loginUserSchema } from "../../../application/validations/user/LoginSchema";
import { googleAuthSchema } from "../../../application/validations/user/GoogleAuthSchema";
import { LoginUserUseCase } from "../../../application/usecases/user/auth/LoginUserUseCase";
import { registerUserSchema } from "../../../application/validations/user/RegisterUserSchema";
import { passwordTokenSchema } from "../../../application/validations/user/PasswordTokenSchema";
import { startRegisterSchema } from "../../../application/validations/user/StartRegisterSchema";
import { RegisterUserUseCase } from "../../../application/usecases/user/auth/RegisterUserUseCase";
import { GoogleAuthUserUseCase } from "../../../application/usecases/user/auth/GoogleAuthUserUseCase";
import { StartRegisterUserUseCase } from "../../../application/usecases/user/auth/StartRegisterUserUseCase";
import { ResetPasswordUserUseCase } from "../../../application/usecases/user/auth/ResetPasswordUserUseCase";
import { ChangePasswordUserUseCase } from "../../../application/usecases/user/auth/ChangePasswordUserUseCase";
import { ForgotPasswordUserUseCase } from "../../../application/usecases/user/auth/ForgotPasswordUserUseCase";
import { currentPasswordNewPasswordSchema } from "../../../application/validations/user/CurrentPasswordNewPasswordSchema";
import { RefreshTokenUserUseCase } from "../../../application/usecases/user/auth/RefreshTokenUserUseCase";
import { AddUserToElasticSearchUseCase } from "../../../application/usecases/user/search/AddUserToElasticSearchUseCase";
import { IndexedUser } from "../../../types/IndexedUser";

export class AuthController {
  constructor(
    private readonly _userRepo: IUserRepository,
    private _addUserToElastic: AddUserToElasticSearchUseCase
  ) {}

  //# ================================================================================================================
  //# START REGISTER USER
  //# ================================================================================================================
  //# POST /api/v1/auth/start-register
  //# Request body: { name: string, username: string, email: string }
  //# This controller send a registration link to the user to continue to create new account.
  //# ================================================================================================================
  startRegister = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const result = validateWithZod(startRegisterSchema, req.body);

      const { name, username, email } = result;

      const useCase = new StartRegisterUserUseCase(this._userRepo);

      const dto: StartRegisterDto = { name, username, email };

      const { token, payload } = await useCase.execute(dto);

      await publishToQueue("emails", {
        type: "VERIFICATION",
        email: payload.email,
        payload: {
          name: payload.name,
          token,
          link: `${config.frontend_URL}/verify?token=${token}`,
        },
      });

      console.log(token)
      
      return res.status(HttpStatus.OK).json({
        message: AUTH_MESSAGES.VERIFICATION_EMAIL_SENT,
        token,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  //# ================================================================================================================
  //# REGISTER USER
  //# ================================================================================================================
  //# POST /api/v1/auth/register
  //# Request body: { name: string, username: string, email: string, password: string }
  //# This controller registers a new user.
  //# ================================================================================================================
  registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { token, password } = req.body;
      if (!token || !password) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: AUTH_MESSAGES.ALL_FIELDS_REQUIRED });
      }

      const decoded = tokenService.verifyEmailVerificationToken(token);
      if (!decoded) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN });
      }

      const result = validateWithZod(registerUserSchema, {
        name: decoded.name,
        username: decoded.username,
        email: decoded.email,
        password,
      });

      const { name, username, email } = result;

      const dto: RegisterDto = { name, username, email, password };

      const useCase = new RegisterUserUseCase(this._userRepo);
      const { user, accessToken, refreshToken } = await useCase.execute(dto);

      await this._addUserToElastic.execute(user);

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(HttpStatus.CREATED).json({
        message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# LOGIN USER
  //# ================================================================================================================
  //# POST /api/v1/auth/login
  //# Request body: { (email: string or username: string), password: string }
  //# This controller logs in a user or artist using their (email or username) and password.
  //# ================================================================================================================
  loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const result = validateWithZod(loginUserSchema, req.body);

      const { identifier, password } = result;

      const dto: LoginRequestDto = { identifier, password };

      const useCase = new LoginUserUseCase(this._userRepo);
      const { user, accessToken, refreshToken } = await useCase.execute(dto);

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(HttpStatus.CREATED).json({
        message: AUTH_MESSAGES.LOGIN_SUCCESS,
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  //#=================================================================================================================
  //# GOOGLE LOGIN USER
  //#=================================================================================================================
  //# POST /api/v1/auth/google-login
  //# Request body: { token: string }
  //# This controller logs in a user using their Google account.
  //#=================================================================================================================
  googleAuthUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const result = validateWithZod(googleAuthSchema, req.body);

      const { token, email, name } = result;

      const dto: GoogleAuthDto = { token, email, name };

      const useCase = new GoogleAuthUserUseCase(this._userRepo);
      const { user, isNewUser, accessToken, refreshToken } =
        await useCase.execute(dto);

      res.cookie("userRefreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      return res.status(isNewUser ? HttpStatus.CREATED : HttpStatus.OK).json({
        message: isNewUser
          ? AUTH_MESSAGES.REGISTRATION_SUCCESS
          : AUTH_MESSAGES.LOGIN_SUCCESS,
        user,
        accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  //#=================================================================================================================
  //# FORGET PASSWORD
  //#=================================================================================================================
  //# POST /api/v1/users/forgot-password
  //# Request body: { email: string }
  //# This controller sends a password reset email to the user's registered email address.
  //#=================================================================================================================
  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const identifier = req.body.identifier as string;

      if (!identifier) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: AUTH_MESSAGES.ALL_FIELDS_REQUIRED });
      }

      const useCase = new ForgotPasswordUserUseCase(this._userRepo);
      const { user, token } = await useCase.execute(identifier);

      await publishToQueue("emails", {
        type: "PASSWORD_RESET",
        email: user.email,
        payload: {
          name: user.name,
          token,
          link: `${config.frontend_URL}/reset-password?token=${token}`,
        },
      });

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.RESET_EMAIL_SENT, email: user?.email });
    } catch (error) {
      next(error);
    }
  };

  //#=================================================================================================================
  //# RESET USER PASSWORD
  //#=================================================================================================================
  //# POST /api/v1/auth/reset-password
  //# Request body: { token: string, password: string }
  //# This controller resets a user's password using their password reset token.
  //#=================================================================================================================
  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const result = validateWithZod(passwordTokenSchema, req.body);

      const { token, password } = result;

      console.log(result);

      const dto: ResetPasswordDto = { token, password };

      const useCase = new ResetPasswordUserUseCase(this._userRepo);
      await useCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS });
    } catch (error) {
      next(error);
    }
  };

  //#=================================================================================================================
  //# CHANGE PASSWORD
  //#=================================================================================================================
  //# POST /api/v1/auth/change-password
  //# Request body: { currentPassword: string, newPassword: string }
  //# This controller changes a user's password using their current password.
  //#=================================================================================================================
  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const result = validateWithZod(
        currentPasswordNewPasswordSchema,
        req.body
      );

      const { currentPassword, newPassword } = result;

      const userId = req.headers["x-user-id"] as string;

      const dto: ChangePasswordDto = { userId, currentPassword, newPassword };

      const useCase = new ChangePasswordUserUseCase(this._userRepo);
      await useCase.execute(dto);

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.PASSWORD_UPDATED });
    } catch (error) {
      next(error);
    }
  };

  //#=================================================================================================================
  //# REFRESH USER ACCESS TOKEN
  //#=================================================================================================================
  //# POST /api/v1/auth/refresh-token
  //# Request headers: { authorization: Bearer refreshToken }
  //# This controller refreshes a user's access token using their refresh token.
  //#=================================================================================================================
  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const refreshToken = req.cookies.userRefreshToken;

      const useCase = new RefreshTokenUserUseCase(this._userRepo);
      const accessToken = await useCase.execute(refreshToken);

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.TOKEN_REFRESH_SUCCESS, accessToken });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# LOGOUT USER
  //# ================================================================================================================
  //# POST /api/v1/auth/logout
  //# Request body: { name: string, username: string, email: string, password: string }
  //# This controller registers a new user.
  //# ================================================================================================================
  logoutUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const refreshToken = req.cookies.userRefreshToken;

      console.log(refreshToken);

      if (!refreshToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED });
      }

      const payload = tokenService.verifyRefreshToken(refreshToken);
      console.log(payload);
      if (typeof payload !== "object" || payload === null) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN });
      }

      res.clearCookie("userRefreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
      next(error);
    }
  };
}
