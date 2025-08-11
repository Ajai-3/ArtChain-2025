import { HttpStatus } from 'art-chain-shared';
import { tokenService } from '../../service/tocken.service';
import { Request, Response, NextFunction } from 'express';
import { validateWithZod } from '../../../utils/zodValidator';
import { AUTH_MESSAGES } from '../../../constants/authMessages';
import { RegisterDto } from '../../../domain/dtos/user/RegisterDto';
import { LoginRequestDto } from '../../../domain/dtos/user/LoginRequestDto';
import { StartRegisterDto } from '../../../domain/dtos/user/StartRegisterDto';
import { ResetPasswordDto } from '../../../domain/dtos/user/ResetPasswordDto';
import { ChangePasswordDto } from '../../../domain/dtos/user/ChangePasswordDto';
import { loginUserSchema } from '../../../application/validations/user/LoginSchema';
import { LoginUserUseCase } from '../../../application/usecases/user/LoginUserUseCase';
import { RegisterUserUseCase } from '../../../application/usecases/user/RegisterUserUseCase';
import { registerUserSchema } from '../../../application/validations/user/RegisterUserSchema';
import { passwordTokenSchema } from '../../../application/validations/user/PasswordTokenSchema';
import { startRegisterSchema } from '../../../application/validations/user/StartRegisterSchema';
import { UserRepositoryImpl } from '../../../infrastructure/repositories/user/UserRepositoryImpl';
import { StartRegisterUserUseCase } from '../../../application/usecases/user/StartRegisterUserUseCase';
import { ResetPasswordUserUseCase } from '../../../application/usecases/user/ResetPasswordUserUseCase';
import { ChangePasswordUserUseCase } from '../../../application/usecases/user/ChangePasswordUserUseCase';
import { ForgotPasswordUserUseCase } from '../../../application/usecases/user/ForgotPasswordUserUseCase';
import { currentPasswordNewPasswordSchema } from '../../../application/validations/user/CurrentPasswordNewPasswordSchema';
import { config } from '../../../infrastructure/config/env';
import { publishToQueue } from '../../../infrastructure/messaging/rabbitmq';

export class AuthController {
  private userRepo: UserRepositoryImpl;

  constructor() {
    this.userRepo = new UserRepositoryImpl();
  }

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

      const useCase = new StartRegisterUserUseCase(this.userRepo);

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

      return res.status(HttpStatus.OK).json({
        message: AUTH_MESSAGES.VERIFICATION_EMAIL_SENT,
        token,
      });
    } catch (error) {
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

      const decoded = await tokenService.verifyEmailVerificationToken(token);
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

      const useCase = new RegisterUserUseCase(this.userRepo);
      const { user, accessToken, refreshToken } = await useCase.execute(dto);

      res.cookie('userRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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

      const useCase = new LoginUserUseCase(this.userRepo);
      const { user, accessToken, refreshToken } = await useCase.execute(dto);

      res.cookie('userRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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

      const useCase = new ForgotPasswordUserUseCase(this.userRepo);
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
        .json({ message: AUTH_MESSAGES.RESET_EMAIL_SENT });
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

      const dto: ResetPasswordDto = { token, password };

      const useCase = new ResetPasswordUserUseCase(this.userRepo);
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
  //# Request headers: { authorization: Bearer accessToken }
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

      const userId = 'cmckaxexr0000bsa8riu3xhdv';

      const dto: ChangePasswordDto = { userId, currentPassword, newPassword };

      const useCase = new ChangePasswordUserUseCase(this.userRepo);
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

      if (!refreshToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED });
      }

      const payload = await tokenService.verifyRefreshToken(refreshToken);

      if (typeof payload !== 'object' || payload === null) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN });
      }

      const accessToken = await tokenService.generateAccessToken(payload);

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

      if (!refreshToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED });
      }

      const payload = await tokenService.verifyRefreshToken(refreshToken);
      if (typeof payload !== 'object' || payload === null) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN });
      }

      res.clearCookie('userRefreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.LOGOUT_SUCCESS });
    } catch (error) {
      next(error);
    }
  };
}