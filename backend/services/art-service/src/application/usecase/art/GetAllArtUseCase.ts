import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ILikeRepository } from '../../../domain/repositories/ILikeRepository';
import { toArtWithUserResponse } from '../../mapper/artWithUserMapper';
import { IGetAllArtUseCase } from '../../interface/usecase/art/IGetAllArtUseCase';
import { ICommentRepository } from '../../../domain/repositories/ICommentRepository';
import { IArtPostRepository } from '../../../domain/repositories/IArtPostRepository';
import { ICategoryRepository } from '../../../domain/repositories/ICategoryRepository';
import { IFavoriteRepository } from '../../../domain/repositories/IFavoriteRepository';
import { IUserService } from '../../interface/service/IUserService';
import type { UserPublicProfile } from '../../../types/user';
import type { ArtRecord, GetAllArtResponse } from '../../../types/usecase';

@injectable()
export class GetAllArtUseCase implements IGetAllArtUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.ILikeRepository) private readonly _likeRepo: ILikeRepository,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository,
    @inject(TYPES.ICategoryRepository)
    private readonly _categoryRepo: ICategoryRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepo: IFavoriteRepository,
    @inject(TYPES.IUserService)
    private readonly _userService: IUserService
  ) {}

  async execute(
    page: number,
    limit: number,
    currentUserId: string,
    categoryId?: string
  ): Promise<GetAllArtResponse> {
    const arts = categoryId
      ? await this._artRepo.getAllByCategory(categoryId, page, limit)
      : await this._artRepo.getAllArt(page, limit);

    if (!arts.length) return [];

    const userIdsSet = new Set<string>();
    const categoryIdsSet = new Set<string>();

    for (const art of arts) {
      if (art.userId) userIdsSet.add(art.userId);
      if (art.categoryId) categoryIdsSet.add(art.categoryId.toString());
    }

    const userIds = Array.from(userIdsSet);
    const categoryIds = Array.from(categoryIdsSet);

    const users = await this._userService.getUsersByIds(userIds);
    const categories = await this._categoryRepo.getCategoriesByIds(categoryIds);

    const userMap = new Map<string, UserPublicProfile>(users.map((u) => [u.id, u]));
    const categoryMap = new Map<string, (typeof categories)[number]>(
      categories.map((c) => [(c as unknown as { _id: string })._id, c]),
    );

    return await Promise.all(
      arts.map(async (art: ArtRecord) => {
        const userData = userMap.get(art.userId) ?? null;
        const categoryData = art.categoryId
          ? categoryMap.get(art.categoryId) ?? null
          : null;

        const artId = art._id?.toString() ?? '';
        const likeCount = await this._likeRepo.likeCountByPostId(artId);
        const commentCount = await this._commentRepo.countByPostId(artId);
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
          artId
        );
        const isLiked = !!(
          currentUserId &&
          (await this._likeRepo.findLike(artId, currentUserId))
        );
        const isFavorited = !!(
          currentUserId &&
          (await this._favoriteRepo.findFavorite(artId, currentUserId))
        );

        return {
          ...toArtWithUserResponse(art, userData ?? undefined),
          category: categoryData,
          isLiked,
          likeCount,
          isFavorited,
          commentCount,
          favoriteCount,
        };
      })
    );
  }
}
