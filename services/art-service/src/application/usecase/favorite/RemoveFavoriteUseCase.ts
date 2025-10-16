import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
import { TYPES } from "../../../infrastructure/invectify/types";
import { FAVORITE_MESSAGES } from "../../../constants/FavoriteMessages";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IRemoveFavoriteUseCase } from "../../interface/usecase/favorite/IRemoveFavoriteUseCase";

@injectable()
export class RemoveFavoriteUseCase implements IRemoveFavoriteUseCase {
  constructor(
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepository: IFavoriteRepository
  ) {}

  async execute(postId: string, userId: string) {
    if (!userId) {
      throw new BadRequestError(FAVORITE_MESSAGES.MISSING_USER_ID);
    }

    if (!postId) {
      throw new BadRequestError(FAVORITE_MESSAGES.MISSING_POST_ID);
    }

    const existingFavorite = await this._favoriteRepository.findFavorite(
      postId,
      userId
    );
    if (!existingFavorite) {
      throw new BadRequestError(FAVORITE_MESSAGES.CANNOT_REMOVE_FAVORITE);
    }

    await this._favoriteRepository.deleteFavorite(postId, userId);
    return { message: FAVORITE_MESSAGES.REMOVE_SUCCESS };
  }
}
