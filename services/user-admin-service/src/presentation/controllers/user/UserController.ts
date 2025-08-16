import { Request, Response, NextFunction } from "express";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/user/UserRepositoryImpl";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { GetCurrentUserUseCase } from "../../../application/usecases/user/user-intraction/GetCurrentUserUseCase";
import { HttpStatus } from "art-chain-shared";
import { USER_MESSAGES } from "../../../constants/userMessages";
import { ISupporterRepository } from "../../../domain/repositories/user/ISupporterRepository";
import { GetUserWithIdUserUseCase } from "../../../application/usecases/user/user-intraction/GetUserWithIdUserUseCase";
import { GetUserProfileWithIdDto } from "../../../domain/dtos/user/GetUserProfileWithIdDto";

export class UserController {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly suppoterRepo: ISupporterRepository
  ) {}

  //# ================================================================================================================
  //# GET CURRENR USER PROFILE
  //# ================================================================================================================
  //# GET /api/v1/user/profile
  //# Request headers: x-user-id
  //# This controller help to get the current loggined user profile.
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
  //# Request params: req.params.userId
  //# This controller help to get other users profile with their id.
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
  //# POST /api/v1/user/support
  //# Request headers: x-user-id
  //# Request params: req.params.userId
  //# This controller help to get the current loggined user profile.
  //# ================================================================================================================
  supportUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string;
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# UNSUPPORT THE USER
  //# ================================================================================================================
  //# POST /api/v1/user/un-support
  //# Request headers: x-user-id
  //# Request params: req.params.userId
  //# This controller help to get the current loggined user profile.
  //# ================================================================================================================
  unSupportUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    try {
      const userId = req.params.userId;
      const currentUserId = req.headers["x-user-id"] as string;
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET CURRENR USER PROFILE
  //# ================================================================================================================
  //# POST /api/v1/user/profile
  //# Request headers: x-user-id
  //# This controller help to get the current loggined user profile.
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
