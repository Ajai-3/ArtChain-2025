import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ERROR_MESSAGES, NotFoundError } from 'art-chain-shared';
import { IUserService } from '../../interface/service/IUserService';
import { toArtWithUserResponse } from '../../mapper/artWithUserMapper';
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
    private readonly _artPostRepo: IArtPostRepository,
  ) {}

  async execute(userId: string, page: number = 1, limit: number = 10) {
    const likes = await this._likeRepo.getAllLikesByUser(
      userId,
      page,
      limit,
    );
    if (!likes || !likes.length) return [];

    const userRes = await this._userService.getUserById(
      userId,
    );
    if (!userRes) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);

    const arts = await Promise.all(
      likes.map(async (like) => {
        const art = await this._artPostRepo.findById(like.postId);
        if (!art) return null;

        const postId = art._id;

        const [likeCount, favoriteCount, commentCount, isLiked, isFavorited] =
          await Promise.all([
            this._likeRepo.likeCountByPostId(postId),
            this._favoriteRepo.favoriteCountByPostId(postId),
            this._commentRepo.countByPostId(postId),
            this._likeRepo.findLike(postId, userId),
            this._favoriteRepo.findFavorite(postId, userId),
          ]);

        return {
          ...toArtWithUserResponse(art, userRes),
          likeCount,
          favoriteCount,
          commentCount,
          isLiked: !!isLiked,
          isFavorited: !!isFavorited,
        };
      }),
    );

    return arts.filter(Boolean);
  }
}
