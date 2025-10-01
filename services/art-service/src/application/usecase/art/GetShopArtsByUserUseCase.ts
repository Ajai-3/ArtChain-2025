import { ERROR_MESSAGES, NotFoundError } from "art-chain-shared";
import { ArtPost } from "../../../domain/entities/ArtPost";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { UserService } from "../../../infrastructure/service/UserService";

export class GetShopArtsByUserUseCase {
  constructor(
    private readonly _artRepo: IArtPostRepository,
    private readonly _favoriteRepo: IFavoriteRepository
  ) {}

  async execute(userId: string, page = 1, limit = 10): Promise<any[]> {
    const userRes = await UserService.getUserById(userId);
    if (!userRes) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const arts = await this._artRepo.findAllByUser(userId, page, limit);

    const artsWithFavorites = await Promise.all(
      arts.map(async (art: any) => {
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(art._id.toString());
        return { ...art, favoriteCount };
      })
    );

    return artsWithFavorites;
  }
}
