import { HttpStatus } from 'art-chain-shared';
import { inject, injectable } from 'inversify';
import { logger } from '../../../utils/logger';
import { Request, Response, NextFunction } from 'express';
import { USER_MESSAGES } from '../../../constants/userMessages';
import { TYPES } from '../../../infrastructure/inversify/types';
import { ARTIST_MESSAGES } from '../../../constants/artistMessages';
import { IUserManageMentController } from './../../interfaces/admin/IUserManagementController';
import { GetAllUsersQueryDto } from '../../../application/interface/dtos/admin/GetAllUsersQueryDto';
import { IGetAllUsersUseCase } from '../../../application/interface/usecases/admin/user-management/IGetAllUsersUseCase';
import { IBanOrUnbanUserUseCase } from '../../../application/interface/usecases/admin/user-management/IBanOrUnbanUserUseCase';
import { ArtistAproveRejectRequestDto } from '../../../application/interface/dtos/admin/user-management/ArtistAproveRejectRequestDto';
import { IRejectArtistRequestUseCase } from '../../../application/interface/usecases/admin/user-management/IRejectArtistRequestUseCase';
import { IGetAllArtistRequestsUseCase } from '../../../application/interface/usecases/admin/user-management/IGetAllArtistRequestsUseCase';
import { IApproveArtistRequestUseCase } from '../../../application/interface/usecases/admin/user-management/IApproveArtistRequestUseCase';

@injectable()
export class UserManageMentController implements IUserManageMentController {
  constructor(
    @inject(TYPES.IGetAllUsersUseCase)
    private readonly _getAllUsersUseCase: IGetAllUsersUseCase,
    @inject(TYPES.IBanOrUnbanUserUseCase)
    private readonly _banOrUnbanUserUseCase: IBanOrUnbanUserUseCase,
    @inject(TYPES.IGetAllArtistRequestsUseCase)
    private readonly _getAllArtistRequestsUseCase: IGetAllArtistRequestsUseCase,
    @inject(TYPES.IApproveArtistRequestUseCase)
    private readonly _approveArtistRequestUseCase: IApproveArtistRequestUseCase,
    @inject(TYPES.IRejectArtistRequestUseCase)
    private readonly _rejectArtistRequestUseCase: IRejectArtistRequestUseCase
  ) {}

  //# ================================================================================================================
  //# GET ALL USERS (Admin)
  //# ================================================================================================================
  //# GET /api/v1/admin/users
  //# Query params: ?page=<number>&limit=<number>&role=<user|artist|user&artist>
  //# This controller allows the admin to fetch a paginated list of users based on their role.
  //# By default, it fetches both users and artists. Admin can filter by specific roles.
  //# ================================================================================================================
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string)?.trim();
      const role = req.query.role as string;
      const status = req.query.status as string;
      const plan = req.query.plan as string;

      const result = await this._getAllUsersUseCase.execute({
        page,
        limit,
        search,
        role,
        status,
        plan,
      });

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.GET_ALL_USERS_SUCCESS,
        meta: result.meta,
        data: result.data,
        stats: result.stats,
      });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# BAN THE USER
  //# ================================================================================================================
  //# PATCH /api/v1/admin/users
  //# Query params: ?page=<number>&limit=<number>&role=<user|artist|user&artist>
  //# This controller allows the admin to fetch a paginated list of users based on their role.
  //# By default, it fetches both users and artists. Admin can filter by specific roles.
  //# ================================================================================================================
  banOrUnbanUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
      }

      const user = await this._banOrUnbanUserUseCase.execute(userId);

      const action = user.status === 'banned' ? 'banned' : 'unbanned';

      return res
        .status(200)
        .json({ message: `User ${action} successfully`, data: user });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET ARTIST REQUEST
  //# ================================================================================================================
  //# PATCH /api/v1/admin/get-artist-requests
  //# Query params: ?page=<number>&limit=<number>
  //# This controller allows the admin to fetch a paginated list of all artist requests
  //# ================================================================================================================
  getAllArtistRequests = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const dto: GetAllUsersQueryDto = { page, limit };
      const result = await this._getAllArtistRequestsUseCase.execute(dto);

      logger.info('Artist request fetched.');
      return res
        .status(HttpStatus.OK)
        .json({ message: ARTIST_MESSAGES.ARTISRT_REQUEST_FETCHED, result });
    } catch (error) {
      logger.error(`Error getting all artist request ${error}`);
      next(error);
    }
  };

  //# ================================================================================================================
  //# APROVE ARTIST REQUEST
  //# ================================================================================================================
  //# PATCH /api/v1/admin/artist-request/:id/approve
  //# Path params: id
  //# This controller allows the admin to approve the artist request
  //# ================================================================================================================
  approveArtistRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Artist request id is required' });
      }

      const dto: ArtistAproveRejectRequestDto = { id };
      const result = await this._approveArtistRequestUseCase.execute(dto);

      logger.info(`Artist request ${id} approved.`);
      return res
        .status(HttpStatus.OK)
        .json({ message: ARTIST_MESSAGES.ARTIST_REQUEST_APPROVED, result });
    } catch (error) {
      logger.error(`Error approving artist request: ${error}`);
      next(error);
    }
  };

  //# ================================================================================================================
  //# REJECT ARTIST REQUEST
  //# ================================================================================================================
  //# PATCH /api/v1/admin/artist-request/:id/reject
  //# Path params: id
  //# This controller allows the admin to reject the artist request
  //# ================================================================================================================
  rejectArtistRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!id) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Artist request id is required' });
      }

      if (!reason) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Rejection reason is required' });
      }

      const dto: ArtistAproveRejectRequestDto = { id, reason };
      const result = await this._rejectArtistRequestUseCase.execute(dto);

      logger.info(`Artist request ${id} rejected. Reason: ${reason}`);
      return res
        .status(HttpStatus.OK)
        .json({ message: ARTIST_MESSAGES.ARTIST_REQUEST_REJECTED, result });
    } catch (error) {
      logger.error(`Error rejecting artist request: ${error}`);
      next(error);
    }
  };
}
