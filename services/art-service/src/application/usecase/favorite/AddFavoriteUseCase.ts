import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { Favorite } from "../../../domain/entities/Favorite";
import { BadRequestError, NotFoundError, ConflictError } from "art-chain-shared";
import { IAddFavoriteUseCase } from "../../interface/usecase/favorite/IAddFavoriteUseCase";
import { FAVORITE_MESSAGES } from "../../../constants/FavoriteMessages";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ART_MESSAGES } from "../../../constants/ArtMessages";

export class AddFavoriteUseCase implements IAddFavoriteUseCase {
  constructor(
    private readonly _artRepo: IArtPostRepository,
    private readonly _favoriteRepository: IFavoriteRepository
  ) {}

  async execute(postId: string, userId: string) {
    if (!postId || !userId) {
      throw new BadRequestError(FAVORITE_MESSAGES.MISSING_USER_ID);
    }

    const post = await this._artRepo.findById(postId);

    if (!post) {
      throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
    }

    const existingFavorite = await this._favoriteRepository.findFavorite(postId, userId);
    if (existingFavorite) {
      throw new ConflictError( FAVORITE_MESSAGES.ALREADY_FAVORITED)
    }

    const favorite = new Favorite(postId, userId);
    const savedFavorite = await this._favoriteRepository.create(favorite);

    return savedFavorite;
  }
}
