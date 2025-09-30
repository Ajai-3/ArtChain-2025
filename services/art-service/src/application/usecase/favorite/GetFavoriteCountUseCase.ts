import { BadRequestError } from "art-chain-shared";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IGetFavoriteCountUseCase } from "../../interface/usecase/favorite/IGetFavoriteCountUseCase";
import { FAVORITE_MESSAGES } from "../../../constants/FavoriteMessages";

export class GetFavoriteCountUseCase implements IGetFavoriteCountUseCase {
  constructor(private readonly _favoriteRepository: IFavoriteRepository) {}

  async execute(postId: string) {
    if (!postId) {
      throw new BadRequestError("Post ID is required.");
    }

    const count = await this._favoriteRepository.favoriteCountByPostId(postId);
    return count;
  }
}
