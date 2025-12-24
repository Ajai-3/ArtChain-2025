import { injectable, inject } from "inversify";
import { IGetAllArtsUseCase } from "../../interface/usecase/admin/IGetAllArtsUseCase";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { UserService } from "../../../infrastructure/service/UserService";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IElasticSearchClient } from "../../../application/interface/clients/IElasticSearchClient";

@injectable()
export class GetAllArtsUseCase implements IGetAllArtsUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository) private readonly _repository: IArtPostRepository,
    @inject(TYPES.ILikeRepository) private readonly _likeRepository: ILikeRepository,
    @inject(TYPES.ICommentRepository) private readonly _commentRepository: ICommentRepository,
    @inject(TYPES.IFavoriteRepository) private readonly _favoriteRepository: IFavoriteRepository,
    @inject(TYPES.IElasticSearchClient) private readonly _elasticsearchClient: IElasticSearchClient
  ) {}

  async execute(
    page: number,
    limit: number,
    filters: any,
    token?: string
  ): Promise<{ data: any[]; meta: any }> {
    let arts: any[];
    let total: number;

    // If search query is provided, use Elasticsearch
    if (filters?.search && filters.search.trim() !== '') {
      const artIds = await this._elasticsearchClient.searchArts(filters.search);
      
      if (artIds.length === 0) {
        return {
          data: [],
          meta: {
            total: 0,
            page,
            limit,
            totalPages: 0,
          },
        };
      }

      // Remove search from filters and add artIds
      const { search, ...otherFilters } = filters;
      const result = await this._repository.findAll(page, limit, { ...otherFilters, artIds });
      arts = result.arts;
      total = result.total;
    } else {
      const result = await this._repository.findAll(page, limit, filters);
      arts = result.arts;
      total = result.total;
    }

    const userIds = [...new Set(arts.map((art) => art.userId).filter((id) => id))];
    let userMap = new Map();

    if (userIds.length > 0) {
      try {
        const users = await this._userService.getUsersByIds(userIds, token);
        userMap = new Map(users.map((u) => [u.id, u]));
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    }

    const enrichedArts = await Promise.all(
      arts.map(async (art) => {
        const [likeCount, commentCount, favoriteCount] = await Promise.all([
          this._likeRepository.likeCountByPostId(art.id),
          this._commentRepository.countByPostId(art.id),
          this._favoriteRepository.favoriteCountByPostId(art.id),
        ]);

        return {
          ...art,
          user: userMap.get(art.userId) || {
            username: "Unknown",
            email: "N/A",
            profileImage: "",
          },
          counts: {
            likes: likeCount,
            comments: commentCount,
            favorites: favoriteCount,
            downloads: 0,
          },
        };
      })
    );

    return {
      data: enrichedArts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
