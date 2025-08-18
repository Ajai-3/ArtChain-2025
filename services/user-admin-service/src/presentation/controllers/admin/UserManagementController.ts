import { Request, Response, NextFunction } from "express";
import { IAdminRepositories } from "../../../domain/repositories/admin/IAdminRepository";
import { HttpStatus } from "art-chain-shared";
import { USER_MESSAGES } from "../../../constants/userMessages";
import { GetAllUsersUseCase } from "../../../application/usecases/admin/GetAllUsersUseCase";

export class UserManageMentController {
  constructor(private readonly adminRepo: IAdminRepositories) {}

//# ================================================================================================================
//# GET ALL USERS (Admin)
//# ================================================================================================================
//# GET /api/v1/admin/users
//# Query params: ?page=<number>&limit=<number>&role=<user|artist|user&artist>
//# This controller allows the admin to fetch a paginated list of users based on their role.
//# By default, it fetches both users and artists. Admin can filter by specific roles.
//# ================================================================================================================
  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const roleQuery = (req.query.role as string)?.toLowerCase();

      const useCase = new GetAllUsersUseCase(this.userRepo)
       const users = await this.userService.getAllUsers({ page, limit });

    res.status(HttpStatus.OK).json({ 
        message: USER_MESSAGES.GET_ALL_USERS_SUCCESS,
        users
     });
    } catch (error) {
      next(error);
    }
  };
}
