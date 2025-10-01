import { ERROR_MESSAGES, NotFoundError } from "art-chain-shared";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { UserService } from "../../../infrastructure/service/UserService";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";

export class GetAllArtWithUserIdUseCase {
  constructor(
    private readonly _artRepo: IArtPostRepository,
    private readonly _likeRepo: ILikeRepository,
    private readonly _commentRepo: ICommentRepository,
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
