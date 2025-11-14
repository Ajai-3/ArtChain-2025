import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { FAVORITE_MESSAGES } from "../../../constants/FavoriteMessages";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IGetFavoriteCountUseCase } from "../../interface/usecase/favorite/IGetFavoriteCountUseCase";

@injectable()
export class GetFavoriteCountUseCase implements IGetFavoriteCountUseCase {
  constructor(
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepository: IFavoriteRepository
  ) {}

  async execute(postId: string) {
    if (!postId) {
      throw new BadRequestError(FAVORITE_MESSAGES.MISSING_POST_ID);
    }

    const count = await this._favoriteRepository.favoriteCountByPostId(postId);
    return count;
  }
}
