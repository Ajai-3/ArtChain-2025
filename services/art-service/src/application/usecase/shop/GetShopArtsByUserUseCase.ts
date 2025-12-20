import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ERROR_MESSAGES, NotFoundError } from "art-chain-shared";
import { UserService } from "../../../infrastructure/service/UserService";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IGetShopArtsByUserUseCase } from "../../interface/usecase/art/IGetAllShopArtsUseCase";

@injectable()
export class GetShopArtsByUserUseCase implements IGetShopArtsByUserUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IFavoriteRepository)
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
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
          art._id.toString()
        );
        return { ...art, favoriteCount, user: userRes };
      })
    );

    return artsWithFavorites;
  }
}
