import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IGetAllArtUseCase } from "../../interface/usecase/art/IGetAllArtUseCase";
import { UserService } from "../../../infrastructure/service/UserService";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { ICategoryRepository } from "../../../domain/repositories/ICategoryRepository";

export class GetAllArtUseCase implements IGetAllArtUseCase {
  constructor(
    private readonly _artRepo: IArtPostRepository,
    private readonly _likeRepo: ILikeRepository,
    private readonly _commentRepo: ICommentRepository,
    private readonly _categoryRepo: ICategoryRepository
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

    // fetch users and categories
    const users = await UserService.getUsersByIds(userIds);
    const categories = await this._categoryRepo.getCategoriesByIds(categoryIds);

    const userMap = new Map(users.map((u: any) => [u.id, u]));
    const categoryMap = new Map(categories.map((c: any) => [c.id, c]));

    // map arts with user and category
    return await Promise.all(
      arts.map(async (art: any) => {
        const userData = userMap.get(art.userId) || null;
        const categoryData = categoryMap.get(art.categoryId) || null;

        const likeCount = await this._likeRepo.likeCountByPostId(art._id);
        const commentCount = await this._commentRepo.countByPostId(art._id);
        const isLiked = !!(
          currentUserId &&
          (await this._likeRepo.findLike(art._id, currentUserId))
        );

        return {
          ...toArtWithUserResponse(art, userData),
          category: categoryData,
          likeCount,
          commentCount,
          isLiked,
        };
      })
    );
  }
}
