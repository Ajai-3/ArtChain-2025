import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { logger } from '../../../utils/logger';
import { Request, Response, NextFunction } from 'express';
import { validateWithZod } from '../../../utils/zodValidator';
import { TYPES } from '../../../infrastructure/inversify/types';

import { USER_MESSAGES } from '../../../constants/userMessages';
import { IUserController } from '../../interfaces/user/IUserController';

import { SupportUnSupportRequestDto } from '../../../application/interface/dtos/user/user-intraction/SupportUnSupportRequestDto';

import { UpdateUserProfileDto } from '../../../application/interface/dtos/user/profile/UpdateUserProfileDto';

import { publishNotification } from '../../../infrastructure/messaging/rabbitmq';

import { updateProfileSchema } from '../../../application/validations/user/updateProfileSchema';
import { GetUserProfileRequestDto } from '../../../application/interface/dtos/user/profile/GetUserProfileRequestDto';
import { IAddUserToElasticSearchUseCase } from '../../../application/interface/usecases/user/search/IAddUserToElasticSearchUseCase';
import { IGetUsersByIdsUserUseCase } from '../../../application/interface/usecases/user/user-intraction/IGetUsersByIdsUserUseCase';
import { IUnSupportUserUseCase } from '../../../application/interface/usecases/user/user-intraction/IUnSupportUserUseCase';
import { IGetUserProfileUseCase } from '../../../application/interface/usecases/user/profile/IGetUserProfileUseCase';
import { IGetUserWithIdUserUseCase } from '../../../application/interface/usecases/user/profile/IGetUserWithIdUserUseCase';
import { IUpdateProfileUserUseCase } from '../../../application/interface/usecases/user/profile/IUpdateProfileUserUseCase';
import { IGetUserSupportersUseCase } from '../../../application/interface/usecases/user/user-intraction/IGetUserSupportersUseCase';
import { IGetUserSupportingUseCase } from '../../../application/interface/usecases/user/user-intraction/IGetUserSupportingUseCase';

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject(TYPES.IGetUserProfileUseCase)
    private readonly _getUserProfileUseCase: IGetUserProfileUseCase,
    @inject(TYPES.IGetUserWithIdUseCase)
    private readonly _getUserWithIdUseCase: IGetUserWithIdUserUseCase,
    @inject(TYPES.ISupportUserUseCase)
    private readonly _supportUserUseCase: IUnSupportUserUseCase,
    @inject(TYPES.IUnSupportUserUseCase)
    private readonly _unSupportUserUseCase: IUnSupportUserUseCase,
    @inject(TYPES.IGetUserSupportersUseCase)
    private readonly _getSupportersUseCase: IGetUserSupportersUseCase,
    @inject(TYPES.IGetUserSupportingUseCase)
    private readonly _getSupportingUseCase: IGetUserSupportingUseCase,
    @inject(TYPES.IGetUsersByIdsUseCase)
    private readonly _getUsersByIdsUserUseCase: IGetUsersByIdsUserUseCase,
    @inject(TYPES.IUpdateProfileUserUseCase)
    private readonly _updateProfileUserUseCase: IUpdateProfileUserUseCase,
    @inject(TYPES.IAddUserToElasticSearchUseCase)
    private readonly _addUserToElasticUserUseCase: IAddUserToElasticSearchUseCase
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
      const currentUserId = req.headers['x-user-id'] as string | undefined;

      console.log(currentUserId);

      const dto: GetUserProfileRequestDto = { username, currentUserId };
      const result = await this._getUserProfileUseCase.execute(dto);

      logger.info(`User profle fetched ${JSON.stringify(result)}`);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_FETCH_SUCCESS,
        data: result,
      });
    } catch (error) {
      logger.error('Error in fetching user profile');
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
      const currentUserId = req.headers['x-user-id'] as string;
      const dto: GetUserProfileRequestDto = { userId, currentUserId };

      const user = await this._getUserWithIdUseCase.execute(dto);

      logger.info(`User ${user.username} Profile fetched with id ${user.id}.`);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_FETCH_SUCCESS,
        data: user,
      });
    } catch (error) {
      logger.error('Error infetching user with id');
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
      const userId = req.headers['x-user-id'] as string;
      if (!userId) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: 'User ID missing in request headers' });
      }
      console.log(req.body, userId);
      const validatedData = validateWithZod(updateProfileSchema, req.body);

      const dto: UpdateUserProfileDto = { ...validatedData, userId };

      const user = await this._updateProfileUserUseCase.execute(dto);

      const elasticUser = await this._addUserToElasticUserUseCase.execute(user);

      await publishNotification('user.update', elasticUser);

      logger.info(`User profile updated ${JSON.stringify(user)}`);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_UPDATE_SUCCESS,
        user,
      });
    } catch (error) {
      logger.error('Error in fetching user with id');
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
      const currentUserId = req.headers['x-user-id'] as string;
      const dto: SupportUnSupportRequestDto = { userId, currentUserId };

      const result = await this._supportUserUseCase.execute(dto);

      await publishNotification('user.supported', {
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
      const currentUserId = req.headers['x-user-id'] as string;
      const dto: SupportUnSupportRequestDto = { userId, currentUserId };

      await this._unSupportUserUseCase.execute(dto);

      logger.info(
        `${currentUserId} un-supported ${userId} at ${new Date().toLocaleString()}`
      );

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
      const userId = req.headers['x-user-id'] as string;
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
      const currentUserId = req.headers['x-user-id'] as string;
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
      const currentUserId = req.headers['x-user-id'] as string;
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
          .json({ message: 'ids array is required' });
      }

      const users = await this._getUsersByIdsUserUseCase.execute(ids);

      logger.info('user with id fetched correctly');
      return res
        .status(HttpStatus.OK)
        .json({ message: 'User fetch correcly', data: users });
    } catch (error) {
      next(error);
    }
  };
}
