import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { tokenService } from "../../service/token.service";
import { validateWithZod } from "../../../utils/zodValidator";
import { AUTH_MESSAGES } from "../../../constants/authMessages";
import { LoginRequestDto } from "../../../domain/dtos/user/auth/LoginRequestDto";
import { IAdminAuthController } from "../../interfaces/admin/IAdminAuthController";
import { loginUserSchema } from "../../../application/validations/user/LoginSchema";
import { LoginAdminUseCase } from "../../../application/usecases/admin/auth/LoginAdminUseCase";
import { RefreshTokenUseCase } from "../../../application/usecases/admin/auth/RefreshTokenUseCase";

export class AdminAuthController implements IAdminAuthController {
  constructor(
    private readonly _loginAdminUseCase: LoginAdminUseCase,
    private readonly _refreshTokenUseCase: RefreshTokenUseCase
  ) {}

  //# ================================================================================================================
  //# ADMIN LOGIN
  //# ================================================================================================================
  //# POST /api/v1/admin/login
  //# Request body: { (email: string or username: string), password: string }
  //# This controller allows admin to login using their (email or username) and password.
  //# ================================================================================================================
  adminLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const result = validateWithZod(loginUserSchema, req.body);

      const { identifier, password } = result;

      const dto: LoginRequestDto = { identifier, password };

      const { user, accessToken, refreshToken } =
        await this._loginAdminUseCase.execute(dto);

      res.cookie("adminRefreshToken", refreshToken, {
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

  //# ================================================================================================================
  //# ADMIN LOGOUT
  //# ================================================================================================================
  //# POST /api/v1/admin/logout
  //# This controller allows admin to logout by clearing their refresh token cookie.
  //# It ensures a refresh token is present and valid before logging out.
  //# ================================================================================================================
  adminLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const refreshToken = req.cookies.adminRefreshToken;

      if (!refreshToken) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED });
      }

      const payload = tokenService.verifyRefreshToken(refreshToken);
      if (typeof payload !== "object" || payload === null) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: AUTH_MESSAGES.INVALID_REFRESH_TOKEN });
      }

      res.clearCookie("adminRefreshToken", {
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

  //# ================================================================================================================
  //# ADMIN REFRESH TOKEN
  //# ================================================================================================================
  //# POST /api/v1/admin/refresh-token
  //# This controller allows admin to get new access token using the refresh token.
  //#================================================================================================================
  refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const refreshToken = req.cookies.adminRefreshToken;

      const { accessToken } = await this._refreshTokenUseCase.execute(
        refreshToken
      );

      return res
        .status(HttpStatus.OK)
        .json({ message: AUTH_MESSAGES.TOKEN_REFRESH_SUCCESS, accessToken });
    } catch (error) {
      next(error);
    }
  };
}
