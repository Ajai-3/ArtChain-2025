import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ERROR_MESSAGES, NotFoundError } from "art-chain-shared";
import { UserService } from "../../../infrastructure/service/UserService";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";

@injectable()
export class GetAllArtWithUserIdUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.ILikeRepository) private readonly _likeRepo: ILikeRepository,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepo: IFavoriteRepository
  ) {}
  async execute(
    page: number,
    limit: number,
    userId: string,
    currentUserId: string
  ): Promise<any[]> {
    const arts = await this._artRepo.getAllByUser(userId, page, limit);
    if (!arts.length) return [];

    console.log(currentUserId, userId);

    const userRes = await UserService.getUserById(userId, currentUserId);
    if (!userRes) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    return await Promise.all(
      arts.map(async (art: any) => {
        const likeCount = await this._likeRepo.likeCountByPostId(art._id);
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
          art._id
        );
        const commentCount = await this._commentRepo.countByPostId(art._id);
        const isLiked = !!(
          currentUserId &&
          (await this._likeRepo.findLike(art._id, currentUserId))
        );
        const isFavorited = !!(
          currentUserId &&
          (await this._favoriteRepo.findFavorite(art._id, currentUserId))
        );

        return {
          ...toArtWithUserResponse(art, userRes.data),
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
