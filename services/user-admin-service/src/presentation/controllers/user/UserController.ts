import { UpdateUserProfileDTO } from "./../../../domain/dtos/user/profile/UpdateUserProfileDTO";
import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";

import { IUserController } from "../../interfaces/user/IUserController";
import { USER_MESSAGES } from "../../../constants/userMessages";

import { SupportUnSupportRequestDto } from "../../../domain/dtos/user/user-intraction/SupportUnSupportRequestDto";

import { SupportUserUseCase } from "../../../application/usecases/user/user-intraction/SupportUserUseCase";
import { UnSupportUserUseCase } from "../../../application/usecases/user/user-intraction/UnSupportUserUseCase";
import { GetCurrentUserUseCase } from "../../../application/usecases/user/user-intraction/GetCurrentUserUseCase";
import { GetUserWithIdUserUseCase } from "../../../application/usecases/user/profile/GetUserWithIdUserUseCase";
import { publishNotification } from "../../../infrastructure/messaging/rabbitmq";
import { logger } from "../../../utils/logger";
import { GetUserSupportersUseCase } from "../../../application/usecases/user/user-intraction/GetUserSupportersUseCase";
import { GetUserSupportingUseCase } from "../../../application/usecases/user/user-intraction/GetUserSupportingUseCase";
import { GetUsersByIdsUserUseCase } from "../../../application/usecases/user/user-intraction/GetUsersByIdsUserUseCase";
import { UpdateProfileUserUseCase } from "../../../application/usecases/user/profile/UpdateProfileUserUseCase";
import { validateWithZod } from "../../../utils/zodValidator";
import { updateProfileSchema } from "../../../application/validations/user/updateProfileSchema";
import { GetUserProfileUseCase } from "../../../application/usecases/user/profile/GetProfileUserUseCase";
import { GetUserProfileRequestDto } from "../../../domain/dtos/user/profile/GetUserProfileRequestDto";
import { AddUserToElasticSearchUseCase } from "../../../application/usecases/user/search/AddUserToElasticSearchUseCase";

export class UserController implements IUserController {
  constructor(
    private readonly _getUserProfileUseCase: GetUserProfileUseCase,
    private readonly _getUserWithIdUseCase: GetUserWithIdUserUseCase,
    private readonly _supportUserUseCase: SupportUserUseCase,
    private readonly _unSupportUserUseCase: UnSupportUserUseCase,
    private readonly _getSupportersUseCase: GetUserSupportersUseCase,
    private readonly _getSupportingUseCase: GetUserSupportingUseCase,
    private readonly _getUsersByIdsUserUseCase: GetUsersByIdsUserUseCase,
    private readonly _updateProfileUserUseCase: UpdateProfileUserUseCase,
    private readonly _addUserToElasticUserUseCase: AddUserToElasticSearchUseCase
  ) {}

  //# ================================================================================================================
  //# GET USER PROFILE (public/private)
  //# ================================================================================================================
  //# GET /api/v1/user/profile/:username
  //# Request headers: x-user-id (optional)
  //# Request params: username
  //# This controller help to get the user profile both current and other user also it will act as public and private route
  //# ================================================================================================================
  getProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { username } = req.params;
      const currentUserId = req.headers["x-user-id"] as string | undefined;

      const dto: GetUserProfileRequestDto = { username, currentUserId };
      const result = await this._getUserProfileUseCase.execute(dto);

      logger.info(`User profle fetched ${JSON.stringify(result)}`);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      logger.error("Error in fetching user profile");
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
      const currentUserId = req.headers["x-user-id"] as string;
      const dto: GetUserProfileRequestDto = { userId, currentUserId };

      const user = await this._getUserWithIdUseCase.execute(dto);

      logger.info(`User ${user.username} Profile fetched with id ${user.id}.`);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_FETCH_SUCCESS,
        data: user,
      });
    } catch (error) {
      logger.error("Error infetching user with id");
      next(error);
    }
  };

  //# ================================================================================================================
  //# UPDATE USER PROFILE
  //# ================================================================================================================
  //# PATCH /api/v1/user/profile
  //# Request headers: x-user-id
  //# Request body: field to update
  //# This controller helps to update the user profile
  //# ================================================================================================================
  updateProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: "User ID missing in request headers" });
      }
      console.log(req.body, userId);
      const validatedData = validateWithZod(updateProfileSchema, req.body);

      const dto: UpdateUserProfileDTO = { ...validatedData, userId };

      const user = await this._updateProfileUserUseCase.execute(dto);

      const elasticUser = await this._addUserToElasticUserUseCase.execute(user);

      await publishNotification("user.update", elasticUser);

      logger.info(`User profile updated ${JSON.stringify(user)}`);
      console.log(user);
      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_UPDATE_SUCCESS,
        user,
      });
    } catch (error) {
      logger.error("Error in fetching user with id");
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
  //# REMOVE THE SUPPORTER
  //# ================================================================================================================
  //# DELETE /api/v1/user/remove/:supporterId
  //# Request headers: x-user-id
  //# This controller helps to remove the supporter of current users suppoters.
  //# ================================================================================================================
  removeSupporter = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const currentUserId = req.params.supporterId;

      console.log(userId, currentUserId);
      const dto: SupportUnSupportRequestDto = { userId, currentUserId };

      await this._unSupportUserUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.SUPPORTER_REMOVED,
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
      const currentUserId = req.headers["x-user-id"] as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      logger.debug(`Get supporing user userId: ${userId}`);
      let supporters = await this._getSupportersUseCase.execute(
        userId,
        page,
        limit
      );
      console.log(currentUserId);
      if (userId === currentUserId) {
        supporters = supporters.filter((s) => s.id !== currentUserId);
      }

      logger.info(`Suppoters fetched ${JSON.stringify(supporters)}`);
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
      const currentUserId = req.headers["x-user-id"] as string;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      logger.debug(`Get supporing user userId: ${userId}`);

      let supporters = await this._getSupportingUseCase.execute(
        userId,
        page,
        limit
      );

      if (userId === currentUserId) {
        supporters = supporters.filter((s) => s.id !== currentUserId);
      }

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.SUPPORTING_FETCH_SUCCESS,
        data: supporters,
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUserWithIds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> => {
    try {
      const { ids } = req.body;

      if (!ids || !Array.isArray(ids) || !ids.length) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: "ids array is required" });
      }

      const users = await this._getUsersByIdsUserUseCase.execute(ids);

      logger.info(`user with id fetched correctly`);
      return res
        .status(HttpStatus.OK)
        .json({ message: "User fetch correcly", data: users });
    } catch (error) {
      next(error);
    }
  };
}
