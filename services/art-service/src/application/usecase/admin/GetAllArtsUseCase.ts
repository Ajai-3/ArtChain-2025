import { injectable, inject } from "inversify";
import { IGetAllArtsUseCase } from "../../interface/usecase/admin/IGetAllArtsUseCase";
import { IAdminArtRepository } from "../../../domain/repository/IAdminArtRepository";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { UserService } from "../../../infrastructure/service/UserService";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";

@injectable()
export class GetAllArtsUseCase implements IGetAllArtsUseCase {
  constructor(
    @inject(TYPES.IAdminArtRepository) private readonly _repository: IAdminArtRepository,
    @inject(TYPES.ILikeRepository) private readonly _likeRepository: ILikeRepository,
    @inject(TYPES.ICommentRepository) private readonly _commentRepository: ICommentRepository,
    @inject(TYPES.IFavoriteRepository) private readonly _favoriteRepository: IFavoriteRepository
  ) {}

  async execute(
    page: number,
    limit: number,
    filters: any,
    token?: string
  ): Promise<{ data: any[]; meta: any }> {
    const { arts, total } = await this._repository.findAll(page, limit, filters);

    const userIds = [...new Set(arts.map((art) => art.userId).filter((id) => id))];
    let userMap = new Map();

    if (userIds.length > 0) {
      try {
        const users = await UserService.getUsersByIds(userIds, token);
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
