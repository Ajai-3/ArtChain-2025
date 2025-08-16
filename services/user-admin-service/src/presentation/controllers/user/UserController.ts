import { Request, Response, NextFunction } from "express";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/user/UserRepositoryImpl";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { GetCurrentUserUseCase } from "../../../application/usecases/user/user-intraction/GetCurrentUserUseCase";
import { HttpStatus } from "art-chain-shared";
import { USER_MESSAGES } from "../../../constants/userMessages";

export class UserController {
  constructor(private readonly userRepo: IUserRepository) {}

  getUserProfile = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = req.headers["x-user-id"] as string;

      const useCase = new GetCurrentUserUseCase(this.userRepo);
      const { user, supportingCount, supportersCount } = await useCase.execute(
        userId
      );

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_FETCH_SUCCESS,
        data: {
          user,
          supportingCount,
          supportersCount,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getUserProfileWithId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = req.params.userId;
    } catch (error) {
      next(error);
    }
  };

  supportUnSupportToggle = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
    } catch (error) {
      next(error);
    }
  };

  getSuppoters = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
    } catch (error) {
      next(error);
    }
  };
}
