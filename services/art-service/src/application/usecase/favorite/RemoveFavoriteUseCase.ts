import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IRemoveFavoriteUseCase } from "../../interface/usecase/favorite/IRemoveFavoriteUseCase";
import { FAVORITE_MESSAGES } from "../../../constants/FavoriteMessages";
import { BadRequestError } from "art-chain-shared";

export class RemoveFavoriteUseCase implements IRemoveFavoriteUseCase {
  constructor(private readonly _favoriteRepository: IFavoriteRepository) {}

  async execute(postId: string, userId: string) {
    if (!postId || !userId) {
      throw new BadRequestError(FAVORITE_MESSAGES.MISSING_USER_ID);
    }

    const existingFavorite = await this._favoriteRepository.findFavorite(postId, userId);
    if (!existingFavorite) {
      throw new BadRequestError(FAVORITE_MESSAGES.CANNOT_REMOVE_FAVORITE);
    }

    await this._favoriteRepository.deleteFavorite(postId, userId);
    return { message: FAVORITE_MESSAGES.REMOVE_SUCCESS };
  }
}
