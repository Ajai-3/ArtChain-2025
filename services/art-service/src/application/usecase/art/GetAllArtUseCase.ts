import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/invectify/types";
import { UserService } from "../../../infrastructure/service/UserService";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";
import { IGetAllArtUseCase } from "../../interface/usecase/art/IGetAllArtUseCase";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";

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
    private readonly _favoriteRepo: IFavoriteRepository
  ) {}

  async execute(
    page: number,
    limit: number,
    currentUserId: string,
    categoryId?: string
  ): Promise<any[]> {
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

    const users = await UserService.getUsersByIds(userIds);
    const categories = await this._categoryRepo.getCategoriesByIds(categoryIds);

    const userMap = new Map(users.map((u: any) => [u.id, u]));
    const categoryMap = new Map(categories.map((c: any) => [c.id, c]));

    return await Promise.all(
      arts.map(async (art: any) => {
        const userData = userMap.get(art.userId) || null;
        const categoryData = categoryMap.get(art.categoryId) || null;

        const likeCount = await this._likeRepo.likeCountByPostId(art._id);
        const commentCount = await this._commentRepo.countByPostId(art._id);
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
          art._id
        );
        const isLiked = !!(
          currentUserId &&
          (await this._likeRepo.findLike(art._id, currentUserId))
        );
        const isFavorited = !!(
          currentUserId &&
          (await this._favoriteRepo.findFavorite(art._id, currentUserId))
        );

        return {
          ...toArtWithUserResponse(art, userData),
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
