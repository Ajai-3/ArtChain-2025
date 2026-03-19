import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ERROR_MESSAGES } from '../../../constants/ErrorMessages';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { IUserService } from '../../interface/service/IUserService';
import { toArtWithUserForFavoriteResponse, toArtWithUserResponse } from '../../mapper/artWithUserMapper';
import { ILikeRepository } from '../../../domain/repositories/ILikeRepository';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { ICommentRepository } from '../../../domain/repositories/ICommentRepository';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { IGetUserFavoritedArtsUseCase } from '../../interface/usecase/favorite/IGetUserFavoritedArtsUseCase';

@injectable()
export class GetUserFavoritedArtsUseCase implements IGetUserFavoritedArtsUseCase {
  constructor(
    @inject(TYPES.ILikeRepository) private readonly _likeRepo: ILikeRepository,
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepo: IFavoriteRepository
  ) { }

  async execute(userId: string, currentUserId: string, page = 1, limit = 15) {
    if (!userId) throw new BadRequestError(ERROR_MESSAGES.USER_ID_MISSING);

    const favorites = await this._favoriteRepo.getAllFavoritesByUser(userId, page, limit);
    if (!favorites.length) return [];

    const artIds = favorites.map(fav => fav.postId);
    const rawArts = await this._artRepo.findByIds(artIds);

    const userIds = [...new Set(rawArts.map(art => art.userId))];
    const users = await this._userService.getUsersByIds(userIds);
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const enrichedArts = await Promise.all(
      rawArts.map(async (art) => {
        const user = userMap.get(art.userId);

        const [likeCount, favoriteCount, commentCount, isLiked, isFavorited] = await Promise.all([
          this._likeRepo.likeCountByPostId(art._id),
          this._favoriteRepo.favoriteCountByPostId(art._id),
          this._commentRepo.countByPostId(art._id),
          currentUserId ? this._likeRepo.findLike(art._id, currentUserId) : null,
          currentUserId ? this._favoriteRepo.findFavorite(art._id, currentUserId) : null,
        ]);

        const baseArtWithUser = toArtWithUserForFavoriteResponse(art, user);

        return {
          ...baseArtWithUser,
          likeCount: likeCount || 0,
          favoriteCount: favoriteCount || 0,
          commentCount: commentCount || 0,
          isLiked: !!isLiked,
          isFavorited: !!isFavorited,
        };
      })
    );

    return enrichedArts;
  }
}