import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/invectify/types";
import { ERROR_MESSAGES, NotFoundError } from "art-chain-shared";
import { UserService } from "../../../infrastructure/service/UserService";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";

@injectable()
export class GetAllShopArtsUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepo: IFavoriteRepository
  ) {}

  async execute(
    page = 1,
    limit = 10,
    filters?: {
      category?: string[];
      priceOrder?: "asc" | "desc";
      titleOrder?: "asc" | "desc";
      minPrice?: number;
      maxPrice?: number;
    }
  ): Promise<any[]> {
    const query: any = { isForSale: true, status: "active" };

    if (filters) {
      console.log("categories", filters.category);
    }

    // Multi-category filter
    if (filters?.category && filters.category.length > 0) {
      query.artType = { $in: filters.category };
    }

    // Price range filter
    if (filters?.minPrice != null || filters?.maxPrice != null) {
      query.$and = [];
      if (filters.minPrice != null)
        query.$and.push({ artcoins: { $gte: filters.minPrice } });
      if (filters.maxPrice != null)
        query.$and.push({ artcoins: { $lte: filters.maxPrice } });
    }

    // Sorting
    const sort: any = {};
    if (filters?.priceOrder)
      sort.artcoins = filters.priceOrder === "asc" ? 1 : -1;
    if (filters?.titleOrder) sort.title = filters.titleOrder === "asc" ? 1 : -1;
    if (!filters?.priceOrder && !filters?.titleOrder) sort.createdAt = -1;

    const arts = await this._artRepo.findAllWithFilters(
      query,
      page,
      limit,
      sort
    );

    if (!arts.length) return [];

    const userIds = arts.map((u) => u.userId);
    const userRes = await UserService.getUsersByIds(userIds);
    if (!userRes) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const mapped = await Promise.all(
      arts.map(async (art: any) => {
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
          art._id
        );
        const user = userRes.find((u: any) => u.id === art.userId);

        return {
          id: art._id,
          title: art.title,
          artName: art.artName,
          previewUrl: art.previewUrl,
          artType: art.artType,
          priceType: art.priceType,
          artcoins: art.artcoins,
          fiatPrice: art.fiatPrice,
          status: art.status,
          favoriteCount,
          user: user
            ? {
                id: user.id,
                name: user.name,
                username: user.username,
                profileImage: user.profileImage,
              }
            : null,
        };
      })
    );

    return mapped;
  }
}
