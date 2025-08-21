import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";

import { IUserController } from "./interfaces/IUserController";
import { USER_MESSAGES } from "../../../constants/userMessages";

import { SupportUnSupportDto } from "../../../domain/dtos/user/SupportUnSupportDto";
import { GetUserProfileWithIdDto } from "../../../domain/dtos/user/GetUserProfileWithIdDto";

import { SupportUserUseCase } from "../../../application/usecases/user/user-intraction/SupportUserUseCase";
import { UnSupportUserUseCase } from "../../../application/usecases/user/user-intraction/UnSupportUserUseCase";
import { GetCurrentUserUseCase } from "../../../application/usecases/user/user-intraction/GetCurrentUserUseCase";
import { GetUserWithIdUserUseCase } from "../../../application/usecases/user/user-intraction/GetUserWithIdUserUseCase";
// import { GetUserSupportersUseCase } from "../../../application/usecases/user/user-intraction/GetUserSupportersUseCase";


export class UserController implements IUserController {
  constructor(
    private readonly _getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly _getUserWithIdUseCase: GetUserWithIdUserUseCase,
    private readonly _supportUserUseCase: SupportUserUseCase,
    private readonly _unSupportUserUseCase: UnSupportUserUseCase,
    // private readonly _getSupportersUseCase: GetUserSupportersUseCase
  ) {}

  //# ================================================================================================================
  //# GET CURRENT USER PROFILE
  //# ================================================================================================================
  //# GET /api/v1/user/profile
  //# Request headers: x-user-id
  //# This controller helps to fetch the currently logged-in user's profile.
  //# ================================================================================================================
  getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { user, supportingCount, supportersCount } = await this._getCurrentUserUseCase.execute(userId);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_FETCH_SUCCESS,
        data: { user, supportingCount, supportersCount },
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET OTHER USER PROFILE
  //# ================================================================================================================
  //# GET /api/v1/user/profile/:userId
  //# Request headers: x-user-id
  //# Request params: userId
  //# This controller helps to fetch another user's profile by their ID.
  //# ================================================================================================================
  getUserProfileWithId = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string | undefined;
      const dto: GetUserProfileWithIdDto = { userId, currentUserId };

      const { user, isSupporting, supportingCount, supportersCount } = await this._getUserWithIdUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_FETCH_SUCCESS,
        data: { user, isSupporting, supportingCount, supportersCount },
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# SUPPORT A USER
  //# ================================================================================================================
  //# POST /api/v1/user/support/:userId
  //# Request headers: x-user-id
  //# Request params: userId
  //# This controller allows the current user to support another user.
  //# ================================================================================================================
  supportUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string;
      const dto: SupportUnSupportDto = { userId, currentUserId };

      await this._supportUserUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.SUPPORT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# UNSUPPORT A USER
  //# ================================================================================================================
  //# DELETE /api/v1/user/un-support/:userId
  //# Request headers: x-user-id
  //# Request params: userId
  //# This controller allows the current user to remove support from another user.
  //# ================================================================================================================
  unSupportUser = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string;
      const dto: SupportUnSupportDto = { userId, currentUserId };

      await this._unSupportUserUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.UNSUPPORT_SUCCESS,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET SUPPORTERS OF A USER
  //# ================================================================================================================
  //# GET /api/v1/user/supporters
  //# Request headers: x-user-id
  //# This controller helps to fetch a list of users who support the current user.
  //# ================================================================================================================
  getSupporters = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      // const userId = req.headers["x-user-id"] as string;
      // const supporters = await this._getSupportersUseCase.execute(userId);

      // return res.status(HttpStatus.OK).json({
      //   message: USER_MESSAGES.SUPPORTERS_FETCH_SUCCESS,
      //   data: supporters,
      // });
    } catch (error) {
      next(error);
    }
  };
}
