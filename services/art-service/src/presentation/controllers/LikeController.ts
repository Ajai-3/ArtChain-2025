import { logger } from '../../utils/logger';
import { HttpStatus } from 'art-chain-shared';
import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { LIKE_MESSAGES } from '../../constants/LikeMessages';
import { TYPES } from '../../infrastructure/Inversify/types';
import { ILikeController } from '../interface/ILikeController';
import { ILikePostUseCase } from '../../application/interface/usecase/like/ILikePostUseCase';
import { IUnlikePostUseCase } from '../../application/interface/usecase/like/IUnlikePostUseCase';
import { IGetLikeCountUseCase } from '../../application/interface/usecase/like/IGetLikeCountUseCase';
import { IGetLikedUsersUseCase } from '../../application/interface/usecase/like/IGetLikedUsersUseCase';
import { IGetUserLikedArtsWithUseCase } from '../../application/interface/usecase/like/IGetUserLikedArtsWithUseCase';

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
    private readonly _getLikedUsersUseCase: IGetLikedUsersUseCase,
    @inject(TYPES.IGetUserLikedArtsWithUseCase)
    private readonly _getUserLikedArtsUseCase: IGetUserLikedArtsWithUseCase
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
      const userId = req.headers['x-user-id'] as string;
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
      const userId = req.headers['x-user-id'] as string;
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
      const currentUserId = req.headers['x-user-id'] as string;

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { users, likeCount } = await this._getLikedUsersUseCase.execute(
        currentUserId,
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

  //# ================================================================================================================
  //# GET USER LIKED ARTS
  //# ================================================================================================================
  //# GET /api/v1/art/likes/user/:userId
  //# This endpoint returns a list of arts the user has liked, with pagination.
  //# ================================================================================================================
  getUserLikedArts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 15;
      const userId = req.headers['x-user-id'] as string;

      console.log(userId);

      const arts = await this._getUserLikedArtsUseCase.execute(
        userId,
        page,
        limit
      );

      console.log(arts);

      logger.info(
        `✅ [GetUserLikedArts] Fetched ${arts.length} liked arts for userId=${userId}`
      );

      return res.status(HttpStatus.OK).json({
        message: LIKE_MESSAGES.FETCH_SUCCESS,
        data: arts,
        page,
        limit,
      });
    } catch (error) {
      next(error);
    }
  };
}
