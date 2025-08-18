import { Request, Response, NextFunction } from "express";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/user/UserRepositoryImpl";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { GetCurrentUserUseCase } from "../../../application/usecases/user/user-intraction/GetCurrentUserUseCase";
import { HttpStatus } from "art-chain-shared";
import { USER_MESSAGES } from "../../../constants/userMessages";
import { ISupporterRepository } from "../../../domain/repositories/user/ISupporterRepository";
import { GetUserWithIdUserUseCase } from "../../../application/usecases/user/user-intraction/GetUserWithIdUserUseCase";
import { GetUserProfileWithIdDto } from "../../../domain/dtos/user/GetUserProfileWithIdDto";
import { SupportUnSupportDto } from "../../../domain/dtos/user/SupportUnSupportDto";
import { SupportUserUseCase } from "../../../application/usecases/user/user-intraction/SupportUserUseCase";
import { UnSupportUserUseCase } from "../../../application/usecases/user/user-intraction/UnSupportUserUseCase";

export class UserController {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly suppoterRepo: ISupporterRepository
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
  ): Promise<any> => {
    try {
      const userId = req.headers["x-user-id"] as string;

      const useCase = new GetCurrentUserUseCase(
        this.userRepo,
        this.suppoterRepo
      );
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
  ): Promise<any> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string | undefined;

      const dto: GetUserProfileWithIdDto = { userId, currentUserId };
      const useCase = new GetUserWithIdUserUseCase(
        this.userRepo,
        this.suppoterRepo
      );
      const { user, isSupporting, supportingCount, supportersCount } =
        await useCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.PROFILE_FETCH_SUCCESS,
        data: {
          user,
          isSupporting,
          supportingCount,
          supportersCount,
        },
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
  ): Promise<any> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string;


      const dto: SupportUnSupportDto = { userId, currentUserId }

      const useCase = new SupportUserUseCase(this.userRepo, this.suppoterRepo)
      await useCase.execute(dto)

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.SUPPORT_SUCCESS
      })

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
  ): Promise<any> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string;

      const dto: SupportUnSupportDto = { userId, currentUserId }

      const useCase = new UnSupportUserUseCase(this.userRepo, this.suppoterRepo)
      await useCase.execute(dto)

      return res.status(HttpStatus.OK).json({
        message: USER_MESSAGES.UNSUPPORT_SUCCESS
      })
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
