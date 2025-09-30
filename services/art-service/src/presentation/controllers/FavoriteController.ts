import { Request, Response, NextFunction } from "express";
import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { IFavoriteController } from "../interface/IFavoriteController";
import { AddFavoriteUseCase } from "../../application/usecase/favorite/AddFavoriteUseCase";
import { RemoveFavoriteUseCase } from "../../application/usecase/favorite/RemoveFavoriteUseCase";
import { GetFavoriteCountUseCase } from "../../application/usecase/favorite/GetFavoriteCountUseCase";
import { FAVORITE_MESSAGES } from "../../constants/FavoriteMessages";
import { GetFavoritedUsersUseCase } from "../../application/usecase/favorite/GetFavoritedUsersUseCase";

export class FavoriteController implements IFavoriteController {
  constructor(
    private readonly _addFavoriteUseCase: AddFavoriteUseCase,
    private readonly _removeFavoriteUseCase: RemoveFavoriteUseCase,
    private readonly _getFavoriteCountUseCase: GetFavoriteCountUseCase,
    private readonly _getFavoritedUsersUseCase: GetFavoritedUsersUseCase
  ) {}

  //# ================================================================================================================
  //# ADD TO FAVORITES
  //# ================================================================================================================
  //# POST /api/v1/art/favorites
  //# Body: { postId }
  //# This endpoint allows a user to add a post to their favorites.
  //# ================================================================================================================
  addFavorite = async (
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
          .json({ message: FAVORITE_MESSAGES.MISSING_USER_ID });
      }

      await this._addFavoriteUseCase.execute(postId, userId);

      logger.info(`User ${userId} added post ${postId} to favorites`);
      return res
        .status(HttpStatus.CREATED)
        .json({ message: FAVORITE_MESSAGES.ADD_SUCCESS });
    } catch (error: any) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# REMOVE FROM FAVORITES
  //# ================================================================================================================
  //# DELETE /api/v1/art/favorites
  //# Body: { postId }
  //# This endpoint allows a user to remove a post from their favorites.
  //# ================================================================================================================
  removeFavorite = async (
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
          .json({ message: FAVORITE_MESSAGES.MISSING_USER_ID });
      }

      await this._removeFavoriteUseCase.execute(postId, userId);

      return res
        .status(HttpStatus.OK)
        .json({ message: FAVORITE_MESSAGES.REMOVE_SUCCESS });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET FAVORITE COUNT
  //# ================================================================================================================
  //# GET /api/v1/art/favorite-count/:postId
  //# This endpoint returns the total number of users who have favorited a given post.
  //# ================================================================================================================
  getFavoriteCount = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { postId } = req.params;
      const count = await this._getFavoriteCountUseCase.execute(postId);

      return res
        .status(HttpStatus.OK)
        .json({ message: FAVORITE_MESSAGES.FETCH_SUCCESS, favorites: count });
    } catch (error) {
      next(error);
    }
  };

  //# ================================================================================================================
  //# GET USERS WHO FAVORITED
  //# ================================================================================================================
  //# GET /api/v1/art/favorites/:postId
  //# This endpoint returns a list of users who have favorited the post.
  //# Pagination can be implemented if needed.
  //# ================================================================================================================
  getFavoritedUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { postId } = req.params;
      const currentUserId = req.headers["x-user-id"] as string;

      const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const { users, favoriteCount } = await this._getFavoritedUsersUseCase.execute(postId, page, limit);

    return res.status(HttpStatus.OK).json({
      message: FAVORITE_MESSAGES.FAVORITED_USERS_FETCHED_SUCCESS,
      users,
      favoriteCount,
      page,
      limit,
    });

    } catch (error) {
      next(error);
    }
  };
}
