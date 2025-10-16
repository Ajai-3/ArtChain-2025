import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { LIKE_MESSAGES } from "../../constants/LikeMessages";
import { TYPES } from "../../infrastructure/invectify/types";
import { ILikeController } from "../interface/ILikeController";
import { ILikePostUseCase } from "../../application/interface/usecase/like/ILikePostUseCase";
import { IUnlikePostUseCase } from "../../application/interface/usecase/like/IUnlikePostUseCase";
import { IGetLikeCountUseCase } from "../../application/interface/usecase/like/IGetLikeCountUseCase";
import { IGetLikedUsersUseCase } from "../../application/interface/usecase/like/IGetLikedUsersUseCase";

@injectable()
export class LikeController implements ILikeController {
  constructor(
    @inject(TYPES.ILikePostUseCase)
    private readonly _likePostUseCase: ILikePostUseCase,
    @inject(TYPES.IUnlikePostUseCase)
    private readonly _unlikePostUseCase: IUnlikePostUseCase,
    @inject(TYPES.IGetLikeCountUseCase)
    private readonly _getLikeCountUseCase: IGetLikeCountUseCase,
    @inject(TYPES.IGetLikedUsersUseCase)
    private readonly _getLikedUsersUseCase: IGetLikedUsersUseCase
  ) {}

  //# ================================================================================================================
  //# LIKE A POST
  //# ================================================================================================================
  //# POST /api/v1/art/likes
  //# Body: { postId }
  //# This endpoint allows a user to like a post.
  //# ================================================================================================================
  likePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { postId } = req.body;

      const savedLike = await this._likePostUseCase.execute(postId, userId);

      logger.info(`💓 User ${userId} successfully liked post ${postId}`);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: LIKE_MESSAGES.LIKE_SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# UNLIKE A POST
  //# ================================================================================================================
  //# DELETE /api/v1/art/dislike
  //# Body: { postId }
  //# This endpoint allows a user to remove their like from a post.
  //# ================================================================================================================
  unlikePost = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.headers["x-user-id"] as string;
      const { postId } = req.body;

      await this._unlikePostUseCase.execute(postId, userId);

      logger.info(`💔 User ${userId} successfully un-liked post ${postId}`);

      return res
        .status(HttpStatus.OK)
        .json({ message: LIKE_MESSAGES.UNLIKE_SUCCESS });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET TOTAL LIKES FOR A POST
  //# ================================================================================================================
  //# GET /api/v1/art/like-count/:postId
  //# This endpoint returns the total number of likes for a given post.
  //# ================================================================================================================
  getLikeCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { postId } = req.params;
      const count = await this._getLikeCountUseCase.execute(postId);

      logger.info(`📊 postId=${postId} has ${count} total likes`);
      return res
        .status(HttpStatus.OK)
        .json({ message: LIKE_MESSAGES.FETCH_SUCCESS, likes: count });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET LIKED USERS
  //# ================================================================================================================
  //# GET /api/v1/art/likes/:postId
  //# This endpoint returns the users who liked the post with pagination
  //# ================================================================================================================
  getLikedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { postId } = req.params;
      const currentUserId = req.headers["x-user-id"] as string;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { users, likeCount } = await this._getLikedUsersUseCase.execute(
        postId,
        page,
        limit
      );

      logger.info(
        `✅ Found ${users.length} liked users for postId=${postId} (total=${likeCount})`
      );
      return res.status(HttpStatus.OK).json({
        message: LIKE_MESSAGES.LIKED_USERS_FETCHED_SUCCESS,
        users,
        likeCount,
        page,
        limit,
      });
    } catch (error) {
      next(error);
    }
  };
}
