import { inject, injectable } from 'inversify';
import { BadRequestError } from 'art-chain-shared';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IUserService } from '../../interface/service/IUserService';
import { FAVORITE_MESSAGES } from '../../../constants/FavoriteMessages';
import { GetFavoritedUsersResponse } from '../../../types/usecase-response';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { IGetFavoritedUsersUseCase } from '../../interface/usecase/favorite/IGetFavoritedUsersUseCase';

@injectable()
export class GetFavoritedUsersUseCase implements IGetFavoritedUsersUseCase {
  constructor(
     @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepository: IFavoriteRepository
  ) {}

  async execute(
    currentUserId: string,
    postId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<GetFavoritedUsersResponse> {
    if (!postId) {
      throw new BadRequestError(FAVORITE_MESSAGES.MISSING_POST_ID);
    }

    const favorites = await this._favoriteRepository.getAllFavoritesByPost(
      postId,
      page,
      limit
    );
    const userIds = favorites.map((fav) => fav.userId);

    const users = await this._userService.getUsersByIds(userIds, currentUserId);

    const result = favorites.map((fav) => {
      const user = users.find((u) => u.id === fav.userId);
      return {
        userId: fav.userId,
        name: user?.name ?? '',
        username: user?.username,
        profileImage: user?.profileImage,
        isSupporting: user?.isSupporting,
        likedAt: fav.createdAt,
      };
    });

    const favoriteCount = await this._favoriteRepository.favoriteCountByPostId(
      postId
    );

    return { users: result, favoriteCount };
  }
}
