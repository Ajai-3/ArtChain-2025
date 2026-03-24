import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ERROR_MESSAGES, NotFoundError } from 'art-chain-shared';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { IGetShopArtsByUserUseCase } from '../../interface/usecase/art/IGetAllShopArtsUseCase';
import { IUserService } from '../../interface/service/IUserService';
import { mapCdnUrl } from '../../../utils/mapCdnUrl';

@injectable()
export class GetShopArtsByUserUseCase implements IGetShopArtsByUserUseCase {
  constructor(
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepo: IFavoriteRepository,
  ) {}

  async execute(userId: string, page = 1, limit = 10): Promise<any[]> {
    const userRes = await this._userService.getUserById(userId);
    if (!userRes) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const arts = await this._artRepo.findAllByUser(userId, page, limit);

    const artsWithFavorites = await Promise.all(
      arts.map(async (art: any) => {
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
          art._id.toString(),
        );
        return {
          ...art,
          previewUrl: mapCdnUrl(art.previewUrl),
          favoriteCount,
          user: userRes,
        };
      }),
    );

    return artsWithFavorites;
  }
}
