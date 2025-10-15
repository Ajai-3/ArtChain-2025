import { inject, injectable } from "inversify";
import { Favorite } from "../../../domain/entities/Favorite";
import { ART_MESSAGES } from "../../../constants/ArtMessages";
import { TYPES } from "../../../infrastructure/invectify/types";
import { FAVORITE_MESSAGES } from "../../../constants/FavoriteMessages";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
} from "art-chain-shared";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IAddFavoriteUseCase } from "../../interface/usecase/favorite/IAddFavoriteUseCase";

@injectable()
export class AddFavoriteUseCase implements IAddFavoriteUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepository: IFavoriteRepository
  ) {}

  async execute(postId: string, userId: string) {
    if (!userId) {
      throw new BadRequestError(FAVORITE_MESSAGES.MISSING_USER_ID);
    }

    if (!!postId) {
      throw new BadRequestError(FAVORITE_MESSAGES.MISSING_POST_ID);
    }

    const post = await this._artRepo.findById(postId);

    if (!post) {
      throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
    }

    const existingFavorite = await this._favoriteRepository.findFavorite(
      postId,
      userId
    );
    if (existingFavorite) {
      throw new ConflictError(FAVORITE_MESSAGES.ALREADY_FAVORITED);
    }

    const favorite = new Favorite(postId, userId);
    const savedFavorite = await this._favoriteRepository.create(favorite);

    return savedFavorite;
  }
}
