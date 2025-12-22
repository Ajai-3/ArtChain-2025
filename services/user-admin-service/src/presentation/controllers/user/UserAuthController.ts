import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { TYPES } from '../../../infrastructure/inversify/types';
import { ILogger } from '../../../application/interface/ILogger';

import { tokenService } from '../../service/token.service';
import { config } from '../../../infrastructure/config/env';
import { validateWithZod } from '../../../utils/zodValidator';
import { AUTH_MESSAGES } from '../../../constants/authMessages';
import { IUserAuthController } from '../../interfaces/user/IUserAuthController';

import { LoginRequestDto } from '../../../application/interface/dtos/user/auth/LoginRequestDto';
import { RegisterRequestDto } from '../../../application/interface/dtos/user/auth/RegisterRequestDto';
import { GoogleAuthRequestDto } from '../../../application/interface/dtos/user/auth/GoogleAuthRequestDto';
import { ResetPasswordRequestDto } from '../../../application/interface/dtos/user/auth/ResetPasswordRequestDto';
import { StartRegisterRequestDto } from '../../../application/interface/dtos/user/auth/StartRegisterRequestDto';

import { loginUserSchema } from '../../../application/validations/user/LoginSchema';
import { googleAuthSchema } from '../../../application/validations/user/GoogleAuthSchema';
import { registerUserSchema } from '../../../application/validations/user/RegisterUserSchema';
import { startRegisterSchema } from '../../../application/validations/user/StartRegisterSchema';
import { passwordTokenSchema } from '../../../application/validations/user/PasswordTokenSchema';
import { forgotPasswordSchema } from '../../../application/validations/user/forgotPasswordSchema';

import { ILoginUserUseCase } from '../../../application/interface/usecases/user/auth/ILoginUserUseCase';
import { ILogoutUserUseCase } from '../../../application/interface/usecases/user/auth/ILogoutUserUseCase';
import { IRefreshTokenUseCase } from '../../../application/interface/usecases/user/auth/IRefreshTokenUseCase';
import { IRegisterUserUseCase } from './../../../application/interface/usecases/user/auth/IRegisterUserUseCase';
import { IGoogleAuthUserUseCase } from '../../../application/interface/usecases/user/auth/IGoogleAuthUserUseCase';
import { IResetPasswordUserUseCase } from '../../../application/interface/usecases/user/auth/IResetPasswordUserUseCase';
import { IStartRegisterUserUseCase } from '../../../application/interface/usecases/user/auth/IStartRegisterUserUseCase';
import { IForgotPasswordUserUseCase } from '../../../application/interface/usecases/user/auth/IForgotPasswordUserUseCase';
import { IInitializeAuthUseCase } from '../../../application/interface/usecases/user/auth/InitializeAuthUseCase';
@injectable()
export class UserAuthController implements IUserAuthController {
  constructor(
    @inject(TYPES.ILogger)
    private readonly _logger: ILogger,
    @inject(TYPES.ILogoutUserUseCase)
    private readonly _logoutUserUseCase: ILogoutUserUseCase,
    @inject(TYPES.IStartRegisterUserUseCase)
    private readonly _startRegisterUserUseCase: IStartRegisterUserUseCase,
    @inject(TYPES.IRegisterUserUseCase)
    private readonly _registerUserUseCase: IRegisterUserUseCase,
    @inject(TYPES.ILoginUserUseCase)
    private readonly _loginUserUseCase: ILoginUserUseCase,
    @inject(TYPES.IGoogleAuthUserUseCase)
    private readonly _googleAuthUserUseCase: IGoogleAuthUserUseCase,
    @inject(TYPES.IForgotPasswordUserUseCase)
    private readonly _forgotPasswordUserUseCase: IForgotPasswordUserUseCase,
    @inject(TYPES.IResetPasswordUserUseCase)
    private readonly _resetPasswordUserUseCase: IResetPasswordUserUseCase,
    @inject(TYPES.IRefreshTokenUseCase)
    private readonly _refreshTokenUserUseCase: IRefreshTokenUseCase,
    @inject(TYPES.IInitializeAuthUseCase)
    private readonly _initializeAuthUseCase: IInitializeAuthUseCase,
  ) {}

  //#=================================================================================================================
  //# INITIALIZE USER AUTH
  //#=================================================================================================================
  //# GET /api/v1/auth/initialize
  //# Request headers: { authorization: Bearer refreshToken }
  //# This controller helps to initialize user authentication by verifying the refresh token and returning new tokens and user data.
  //#=================================================================================================================
  initializeAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const refreshToken =
        req.cookies.adminRefreshToken || req.cookies.userRefreshToken;

      const { accessToken, user } = await this._initializeAuthUseCase.execute(
        refreshToken
      );

      this._logger.info(
        `Auth initialized for user: ${user.email}`
      );

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.AUTH_INITIALIZED, accessToken, user });
    } catch (error) {
      next(error);
    }
  };

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
  ): Promise<Response | void> => {
    try {
      const dto: StartRegisterRequestDto = validateWithZod(startRegisterSchema, req.body);
      const { token, payload } = await this._startRegisterUserUseCase.execute(
        dto
      );

      this._logger.info(`Start registration sucessfull of user ${payload.name}`);

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
  ): Promise<Response | void> => {
    try {
      const { token, password } = req.body;

      const decoded = tokenService.verifyEmailVerificationToken(token);
      if (!decoded) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ error: AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN });
      }

      const dto: RegisterRequestDto = validateWithZod(registerUserSchema, {
        name: decoded.name,
        username: decoded.username,
        email: decoded.email,
        password,
      });

      const { user, accessToken, refreshToken } =
        await this._registerUserUseCase.execute(dto);

      res.cookie('userRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });


      this._logger.info(`${user.username} account created successfully.`);

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
  ): Promise<Response | void> => {
    try {
      const dto: LoginRequestDto = validateWithZod(loginUserSchema, req.body);
      const { user, accessToken, refreshToken } =
        await this._loginUserUseCase.execute(dto);

      res.cookie('userRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      this._logger.info(
        `${user.username} Logged at ${new Date().toLocaleTimeString()}`
      );

      return res.status(HttpStatus.OK).json({
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
  ): Promise<Response | void> => {
    try {
      const dto: GoogleAuthRequestDto = validateWithZod(googleAuthSchema, req.body);
      const { user, isNewUser, accessToken, refreshToken } =
        await this._googleAuthUserUseCase.execute(dto);

      res.cookie('userRefreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      this._logger.info(
        `${user.username} has ${
          isNewUser ? 'just registered (new user)' : 'logged in (existing user)'
        }`
      );

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
  ): Promise<Response | void> => {
    try {
      const { identifier } = validateWithZod(forgotPasswordSchema, req.body);

      const { user } = await this._forgotPasswordUserUseCase.execute(
        identifier
      );

      this._logger.info(`Password reset requested for email: ${identifier}`);

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.RESET_EMAIL_SENT, email: user.email });
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
  ): Promise<Response | void> => {
    try {
      const dto: ResetPasswordRequestDto = validateWithZod(passwordTokenSchema, req.body);
      await this._resetPasswordUserUseCase.execute(dto);

      this._logger.info(
        `Password reset attempt with token: ${JSON.stringify(dto.token)} for user.`
      );

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.PASSWORD_RESET_SUCCESS });
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
  ): Promise<Response | void> => {
    try {
      const refreshToken =
        req.cookies.adminRefreshToken || req.cookies.userRefreshToken;

      const { accessToken } = await this._refreshTokenUserUseCase.execute(
        refreshToken
      );

      this._logger.info(
        `Access token refresh requested. Refresh token present: ${JSON.stringify(
          refreshToken
        )}`
      );

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
  ): Promise<Response | void> => {
    try {
      const refreshToken = req.cookies.userRefreshToken;

      await this._logoutUserUseCase.execute(refreshToken);

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
