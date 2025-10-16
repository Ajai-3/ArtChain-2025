import { logger } from "../../utils/logger";
import { HttpStatus } from "art-chain-shared";
import { inject, injectable } from "inversify";
import { Request, Response, NextFunction } from "express";
import { TYPES } from "../../infrastructure/invectify/types";
import { FAVORITE_MESSAGES } from "../../constants/FavoriteMessages";
import { IFavoriteController } from "../interface/IFavoriteController";
import { IAddFavoriteUseCase } from "../../application/interface/usecase/favorite/IAddFavoriteUseCase";
import { IRemoveFavoriteUseCase } from "../../application/interface/usecase/favorite/IRemoveFavoriteUseCase";
import { IGetFavoriteCountUseCase } from "../../application/interface/usecase/favorite/IGetFavoriteCountUseCase";
import { IGetFavoritedUsersUseCase } from "../../application/interface/usecase/favorite/IGetFavoritedUsersUseCase";
import { IGetUserFavoritedArtsUseCase } from "../../application/interface/usecase/favorite/IGetUserFavoritedArtsUseCase";

@injectable()
export class FavoriteController implements IFavoriteController {
  constructor(
    @inject(TYPES.IAddFavoriteUseCase)
    private readonly _addFavoriteUseCase: IAddFavoriteUseCase,
    @inject(TYPES.IRemoveFavoriteUseCase)
    private readonly _removeFavoriteUseCase: IRemoveFavoriteUseCase,
    @inject(TYPES.IGetFavoriteCountUseCase)
    private readonly _getFavoriteCountUseCase: IGetFavoriteCountUseCase,
    @inject(TYPES.IGetFavoritedUsersUseCase)
    private readonly _getFavoritedUsersUseCase: IGetFavoritedUsersUseCase,
    @inject(TYPES.IGetUserFavoritedArtsUseCase)
    private readonly _getUserFavoritedArtsUseCase: IGetUserFavoritedArtsUseCase
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

      await this._addFavoriteUseCase.execute(postId, userId);

      logger.info(
        `✅ [AddFavorite] User ${userId} successfully added post ${postId} to favorites`
      );
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

      await this._removeFavoriteUseCase.execute(postId, userId);

      logger.info(
        `✅ [RemoveFavorite] User ${userId} removed post ${postId} from favorites`
      );
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

      logger.info(
        `✅ [GetFavoriteCount] postId=${postId} has ${count} favorites`
      );
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

      const { users, favoriteCount } =
        await this._getFavoritedUsersUseCase.execute(postId, page, limit);

      logger.info(
        `✅ [GetFavoritedUsers] Found ${users.length} users for postId=${postId} (total=${favoriteCount})`
      );

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

  //# ================================================================================================================
  //# GET USER FAVORITED ARTS
  //# ================================================================================================================
  //# GET /api/v1/art/favorites/user/:userId
  //# This endpoint returns a list of arts wh
  //# Pagination can be implemented if needed.
  //# ================================================================================================================
  getUserFavoritedArts = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const userId = req.params.userId;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 15;
      const currentUserId = req.headers["x-user-id"] as string;

      const arts = await this._getUserFavoritedArtsUseCase.execute(
        userId,
        currentUserId,
        page,
        limit
      );

      logger.info(
        `✅ [GetUserFavoritedArts] Fetched ${arts.length} favorited arts for userId=${userId}`
      );

      return res.status(HttpStatus.OK).json({
        data: arts,
        page,
        limit,
      });
    } catch (error) {
      next(error);
    }
  };
}
