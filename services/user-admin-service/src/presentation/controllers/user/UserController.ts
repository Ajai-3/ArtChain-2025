import { HttpStatus } from 'art-chain-shared';
import { injectable, inject } from 'inversify';
import { logger } from '../../../utils/logger';
import { Request, Response, NextFunction } from 'express';
import { validateWithZod } from '../../../utils/zodValidator';
import { TYPES } from '../../../infrastructure/inversify/types';
import { USER_MESSAGES } from '../../../constants/userMessages';
import { IUserController } from '../../interfaces/user/IUserController';
import { updateProfileSchema } from '../../../application/validations/user/updateProfileSchema';
import { UpdateUserProfileDto } from '../../../application/interface/dtos/user/profile/UpdateUserProfileDto';
import { IGetUserProfileUseCase } from '../../../application/interface/usecases/user/profile/IGetUserProfileUseCase';
import { GetUserProfileRequestDto } from '../../../application/interface/dtos/user/profile/GetUserProfileRequestDto';
import { IUnSupportUserUseCase } from '../../../application/interface/usecases/user/user-intraction/IUnSupportUserUseCase';
import { IUpdateProfileUserUseCase } from '../../../application/interface/usecases/user/profile/IUpdateProfileUserUseCase';
import { IGetUserWithIdUserUseCase } from '../../../application/interface/usecases/user/profile/IGetUserWithIdUserUseCase';
import { SupportUnSupportRequestDto } from '../../../application/interface/dtos/user/user-intraction/SupportUnSupportRequestDto';
import { IGetUserSupportersUseCase } from '../../../application/interface/usecases/user/user-intraction/IGetUserSupportersUseCase';
import { IGetUsersByIdsUserUseCase } from '../../../application/interface/usecases/user/user-intraction/IGetUsersByIdsUserUseCase';
import { IGetUserSupportingUseCase } from '../../../application/interface/usecases/user/user-intraction/IGetUserSupportingUseCase';
import { getUsersBatchSchema } from '../../../application/validations/user/getUsersBatchSchema';
import { GetSupportersRequestDto } from '../../../application/interface/dtos/user/user-intraction/GetSupportersRequestDto';
import { GetSupportingRequestDto } from '../../../application/interface/dtos/user/user-intraction/GetSupportingRequestDto';

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
      const currentUserId = req.headers['x-user-id'] as string;

      // be - add zod validation here
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
 
      // be - add zod validation here
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

      const validatedData = validateWithZod(updateProfileSchema, req.body);

      const dto: UpdateUserProfileDto = { ...validatedData, userId };
      const user = await this._updateProfileUserUseCase.execute(dto);

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

      // be - add zod validation here
      const dto: SupportUnSupportRequestDto = { userId, currentUserId };
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

      // be - add zod validation here
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

      // be - add zod validation here
      logger.debug(`Get supporing user userId: ${userId}`);

      // be - user propper dto to pass the values
      const supporters = await this._getSupportersUseCase.execute({
        currentUserId,
        userId,
        page,
        limit
      });

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

      // be - add zod validation here
      logger.debug(`Get supporing user userId: ${userId}`);

      // be - make it to propper dto to pass values
      const supporters = await this._getSupportingUseCase.execute({
        currentUserId,
        userId,
        page,
        limit
      });

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.SUPPORTING_FETCH_SUCCESS,
        data: supporters,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET USERS WITH IDS
  //# ================================================================================================================
  //# POST /api/v1/user/batch
  //# Request body: array of user ids
  //# This controller helps to fetch a list of users with their ids
  //# ================================================================================================================
  getAllUserWithIds = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | any> => {
    try {
      const { ids, currentUserId } = validateWithZod(getUsersBatchSchema, req.body);

      const users = await this._getUsersByIdsUserUseCase.execute(ids, currentUserId);

      logger.info('user with id fetched correctly');

      return res
        .status(HttpStatus.OK)
        .json({ message: 'User fetch correcly', data: users });
    } catch (error) {
      next(error);
    }
  };
}
