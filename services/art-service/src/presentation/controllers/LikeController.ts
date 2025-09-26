import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { ILikeController } from "../interface/ILikeController";
import { Like } from "../../domain/entities/Like";
import { ILikeRepository } from "../../domain/repositories/ILikeRepository";
import { LikePostUseCase } from "../../application/usecase/like/LikePostUseCase";
import { UnlikePostUseCase } from "../../application/usecase/like/UnlikePostUseCase";
import { GetLikeCountUseCase } from "../../application/usecase/like/GetLikeCountUseCase";
import { LIKE_MESSAGES } from "../../constants/LikeMessages";

export class LikeController implements ILikeController {
  constructor(
    private readonly _likePostUseCase: LikePostUseCase,
    private readonly _unlikePostUseCase: UnlikePostUseCase,
    private readonly _getLikeCountUseCase: GetLikeCountUseCase
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

      console.log(userId)

      if (!userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: LIKE_MESSAGES.MISSING_USER_ID });
      }

      const savedLike = await this._likePostUseCase.execute(postId, userId);

      logger.info(`User ${userId} liked post ${postId}`);
      return res.status(HttpStatus.CREATED).json({ message: LIKE_MESSAGES.LIKE_SUCCESS });
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

      if (!userId) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: LIKE_MESSAGES.MISSING_USER_ID });
      }

      await this._unlikePostUseCase.execute(postId, userId);

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
  //# GET /api/v1/art/likes/:postId
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

      return res
        .status(HttpStatus.OK)
        .json({ message: LIKE_MESSAGES.FETCH_SUCCESS, likes: count });
    } catch (error) {
      next(error);
    }
  };
}
