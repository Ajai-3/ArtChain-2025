import { HttpStatus } from "art-chain-shared";
import { Request, Response, NextFunction } from "express";
import { USER_MESSAGES } from "../../../constants/userMessages";
import { IUserManageMentController } from "./../../interfaces/admin/IUserManagementController";
import { GetAllUsersUseCase } from "../../../application/usecases/admin/user-management/GetAllUsersUseCase";
import { BanOrUnbanUserUseCase } from "../../../application/usecases/admin/user-management/BanOrUnbanUserUseCase";

export class UserManageMentController implements IUserManageMentController {
  constructor(
    private readonly _getAllUsersUseCase: GetAllUsersUseCase,
    private readonly _banOrUnbanUserUseCase: BanOrUnbanUserUseCase
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

      const result = await this._getAllUsersUseCase.execute({
        page,
        limit,
        search,
      });

      console.log(result);

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
}
