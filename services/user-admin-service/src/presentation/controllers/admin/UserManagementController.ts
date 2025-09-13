import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { USER_MESSAGES } from "../../../constants/userMessages";
import { IUserManageMentController } from "./../../interfaces/admin/IUserManagementController";
import { GetAllUsersUseCase } from "../../../application/usecases/admin/user-management/GetAllUsersUseCase";
import { BanOrUnbanUserUseCase } from "../../../application/usecases/admin/user-management/BanOrUnbanUserUseCase";
import axios from "axios";
import { logger } from "../../../utils/logger";
import { ARTIST_MESSAGES } from "../../../constants/artistMessages";
import { GetAllArtistRequestsUseCase } from "../../../application/usecases/admin/user-management/GetAllArtistRequests";
import { GetAllUsersQueryDTO } from "../../../domain/dtos/admin/GetAllUsersQueryDTO";

export class UserManageMentController implements IUserManageMentController {
  constructor(
    private readonly _getAllUsersUseCase: GetAllUsersUseCase,
    private readonly _banOrUnbanUserUseCase: BanOrUnbanUserUseCase,
    private readonly _getAllArtistRequestsUseCase: GetAllArtistRequestsUseCase
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

      let userIds: string[] | undefined;

      if (search) {
        const response = await axios.get(
          `http://elastic-search-service:4004/api/v1/elastic-user/admin/search`,
          {
            params: { q: search },
          }
        );

        userIds = response.data.userIds;
      }

      const result = await this._getAllUsersUseCase.execute({
        page,
        limit,
        search,
        userIds,
      });

      res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.GET_ALL_USERS_SUCCESS,
        meta: result.meta,
        data: result.data,
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
        return res.status(400).json({ message: "Missing userId" });
      }

      const user = await this._banOrUnbanUserUseCase.execute(userId);

      const action = user.status === "banned" ? "banned" : "unbanned";

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

      const dto: GetAllUsersQueryDTO = {page, limit}
      const result = await this._getAllArtistRequestsUseCase.execute(dto)

      logger.info(`Artist request fetched.`);
      return res.status(HttpStatus.OK).json({ message: ARTIST_MESSAGES.ARTISRT_REQUEST_FETCHED , result })
    } catch (error) {
      logger.error(`Error getting all artist request ${error}`);
      next(error);
    }
  };
}
