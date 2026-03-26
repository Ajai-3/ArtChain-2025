import { inject, injectable } from 'inversify';
import { BadRequestError } from 'art-chain-shared';
import { ART_MESSAGES } from '../../../constants/ArtMessages';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IUserService } from '../../interface/service/IUserService';
import { toArtWithUserForLikeResponse } from '../../mapper/artWithUserMapper';
import { ILikeRepository } from '../../../domain/repositories/ILikeRepository';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { ICommentRepository } from '../../../domain/repositories/ICommentRepository';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { IGetUserLikedArtsWithUseCase } from '../../interface/usecase/like/IGetUserLikedArtsWithUseCase';

@injectable()
export class GetUserLikedArtsWithUseCase implements IGetUserLikedArtsWithUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.ILikeRepository) private readonly _likeRepo: ILikeRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepo: IFavoriteRepository,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository,
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
  ) { }

  async execute(userId: string, page: number = 1, limit: number = 10) {
    if (!userId) {
      throw new BadRequestError(ART_MESSAGES.USER_ID_REQUIRED);
    }

    const likes = await this._likeRepo.getAllLikesByUser(
      userId,
      page,
      limit,
    );
    if (!likes || !likes.length) return [];

    const artIds = likes.map(fav => fav.postId);
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
          this._likeRepo.findLike(art._id, userId),
          this._favoriteRepo.findFavorite(art._id, userId),
        ]);

        const baseResponse = toArtWithUserForLikeResponse(art, user);

        return {
          ...baseResponse,
          likeCount: likeCount || 0,
          favoriteCount: favoriteCount || 0,
          commentCount: commentCount || 0,
          isLiked: !!isLiked,
          isFavorited: !!isFavorited,
        };
      })
    );

    return enrichedArts.filter(Boolean);
  }
}
