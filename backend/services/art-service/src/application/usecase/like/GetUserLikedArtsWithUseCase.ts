import { inject, injectable } from 'inversify';
import { BadRequestError } from 'art-chain-shared';
import type { UserPublicProfile } from '../../../types/user';
import { ART_MESSAGES } from '../../../constants/ArtMessages';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IUserService } from '../../interface/service/IUserService';
import { GetUserLikedArtsResponse } from '../../../types/usecase-response';
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

  async execute(userId: string, page: number = 1, limit: number = 10): Promise<GetUserLikedArtsResponse> {
    if (!userId) {
      throw new BadRequestError(ART_MESSAGES.USER_ID_REQUIRED);
    }

    const likes = await this._likeRepo.getAllLikesByUser(
      userId,
      page,
      limit,
    );
    if (!likes || !likes.length) {
      return { arts: [], page, limit, total: 0, length: 0 };
    }

    const artIds = likes.map(fav => fav.postId);
    const rawArts = await this._artRepo.findByIds(artIds);

    const userIds = [...new Set(rawArts.map(art => art.userId))];
    const users = await this._userService.getUsersByIds(userIds);
    const userMap = new Map<string, UserPublicProfile>(users.map((u) => [u.id, u]));

    const enrichedArts = await Promise.all(
      rawArts.map(async (art) => {
        const user = userMap.get(art.userId);
        const artId = (art._id)?.toString() || art.id || '';

        const [likeCount, favoriteCount, commentCount, isLiked, isFavorited] = await Promise.all([
          this._likeRepo.likeCountByPostId(artId),
          this._favoriteRepo.favoriteCountByPostId(artId),
          this._commentRepo.countByPostId(artId),
          this._likeRepo.findLike(artId, userId),
          this._favoriteRepo.findFavorite(artId, userId),
        ]);

        const baseResponse = toArtWithUserForLikeResponse(art, user!);

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

    return {
      arts: enrichedArts,
      page,
      limit,
      total: likes.length,
      length: enrichedArts.length
    };
  }
}
