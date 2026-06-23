import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ERROR_MESSAGES, NotFoundError } from 'art-chain-shared';
import { ILikeRepository } from '../../../domain/repositories/ILikeRepository';
import { toArtWithUserResponse } from '../../mapper/artWithUserMapper';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { ICommentRepository } from '../../../domain/repositories/ICommentRepository';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { IUserService } from '../../interface/service/IUserService';
import type { ArtPostLean } from '../../../types/art';
import type { GetAllArtItem } from '../../../types/usecase';
import { IGetAllArtWithUserIdUseCase } from '../../interface/usecase/art/IGetAllArtWithUserIdUseCase';

@injectable()
export class GetAllArtWithUserIdUseCase implements IGetAllArtWithUserIdUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.ILikeRepository) private readonly _likeRepo: ILikeRepository,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepo: IFavoriteRepository,
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService
  ) {}
  async execute(
    page: number,
    limit: number,
    userId: string,
    currentUserId: string
  ): Promise<Array<Omit<GetAllArtItem, 'category'>>> {
    const arts = await this._artRepo.getAllByUser(userId, page, limit);
    if (!arts.length) return [];


    const userRes = await this._userService.getUserById(userId, currentUserId);
    if (!userRes) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return await Promise.all(
      arts.map(async (art: ArtPostLean) => {
        const artId = art._id?.toString() ?? '';
        const likeCount = await this._likeRepo.likeCountByPostId(artId);
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
          artId
        );
        const commentCount = await this._commentRepo.countByPostId(artId);
        const isLiked = !!(
          currentUserId &&
          (await this._likeRepo.findLike(artId, currentUserId))
        );
        const isFavorited = !!(
          currentUserId &&
          (await this._favoriteRepo.findFavorite(artId, currentUserId))
        );

        return {
          ...toArtWithUserResponse(art, userRes ?? undefined),
          likeCount,
          favoriteCount,
          commentCount,
          isFavorited,
          isLiked,
        };
      })
    );
  }
}
