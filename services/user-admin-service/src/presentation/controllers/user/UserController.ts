import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";

import { IUserController } from "../../interfaces/user/IUserController";
import { USER_MESSAGES } from "../../../constants/userMessages";

import { SupportUnSupportRequestDto } from "../../../domain/dtos/user/user-intraction/SupportUnSupportRequestDto";
import { GetUserProfileWithIdRequestDto } from "../../../domain/dtos/user/user-intraction/GetUserProfileWithIdRequestDto";

import { SupportUserUseCase } from "../../../application/usecases/user/user-intraction/SupportUserUseCase";
import { UnSupportUserUseCase } from "../../../application/usecases/user/user-intraction/UnSupportUserUseCase";
import { GetCurrentUserUseCase } from "../../../application/usecases/user/user-intraction/GetCurrentUserUseCase";
import { GetUserWithIdUserUseCase } from "../../../application/usecases/user/user-intraction/GetUserWithIdUserUseCase";
import { publishNotification } from "../../../infrastructure/messaging/rabbitmq";
import { logger } from "../../../utils/logger";
import { GetUserSupportersUseCase } from "../../../application/usecases/user/user-intraction/GetUserSupportersUseCase";
import { GetUserSupportingUseCase } from "../../../application/usecases/user/user-intraction/GetUserSupportingUseCase";

export class UserController implements IUserController {
  constructor(
    private readonly _getCurrentUserUseCase: GetCurrentUserUseCase,
    private readonly _getUserWithIdUseCase: GetUserWithIdUserUseCase,
    private readonly _supportUserUseCase: SupportUserUseCase,
    private readonly _unSupportUserUseCase: UnSupportUserUseCase,
    private readonly _getSupportersUseCase: GetUserSupportersUseCase,
    private readonly _getSupportingUseCase: GetUserSupportingUseCase
  ) {}

  //# ================================================================================================================
  //# GET CURRENT USER PROFILE
  //# ================================================================================================================
  //# GET /api/v1/user/profile
  //# Request headers: x-user-id
  //# This controller helps to fetch the currently logged-in user's profile.
  //# ================================================================================================================
  getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { user, supportingCount, supportersCount } =
        await this._getCurrentUserUseCase.execute(userId);

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
  getUserProfileWithId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string | undefined;
      const dto: GetUserProfileWithIdRequestDto = { userId, currentUserId };

      const { user, isSupporting, supportingCount, supportersCount } =
        await this._getUserWithIdUseCase.execute(dto);

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
  supportUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string;
      const dto: SupportUnSupportRequestDto = { userId, currentUserId };

      const result = await this._supportUserUseCase.execute(dto);

      await publishNotification("user.supported", {
        supportedUserId: result.targetUser.id,
        supporterId: result.supporter.id,
        supporterName: result.supporter.username,
        supporterProfile: result.supporter.profileImage,
        createdAt: result.createdAt,
      });

      logger.info(
        `${result.supporter.username} supported ${result.targetUser.username} at ${result.createdAt}`
      );

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
  unSupportUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string;
      const dto: SupportUnSupportRequestDto = { userId, currentUserId };

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
  //# GET /api/v1/user/:id/supporters
  //# Request headers: x-user-id
  //# This controller helps to fetch a list of users that supports this user
  //# ================================================================================================================
  getSupporters = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.params.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      logger.debug(`Get supporing user userId: ${userId}`);
      const supporters = await this._getSupportersUseCase.execute(
        userId,
        page,
        limit
      );
      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.SUPPORTERS_FETCH_SUCCESS,
        data: supporters,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET SUPPORTING OF A USER
  //# ================================================================================================================
  //# GET /api/v1/user/:id/supporting
  //# Request headers: x-user-id
  //# This controller helps to fetch a list of users that this user is supporting
  //# ================================================================================================================
  getSupporing = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.params.id;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      logger.debug(`Get supporing user userId: ${userId}`);

      logger.info(`Sucess mesage`);
      const supporters = await this._getSupportingUseCase.execute(
        userId,
        page,
        limit
      );
      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.SUPPORTING_FETCH_SUCCESS,
        data: supporters,
      });
    } catch (error) {
      next(error);
    }
  };
}
