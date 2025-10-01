import { BadRequestError, NotFoundError } from "art-chain-shared";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { UserService } from "../../../infrastructure/service/UserService";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";
import { ERROR_MESSAGES } from "../../../constants/ErrorMessages";

export class GetUserFavoritedArtsUseCase {
  constructor(
    private readonly _likeRepo: ILikeRepository,
    private readonly _artRepo: IArtPostRepository,
    private readonly _commentRepo: ICommentRepository,
    private readonly _favoriteRepo: IFavoriteRepository
  ) {}

  async execute(userId: string, currentUserId: string, page = 1, limit = 15) {
    if (!userId) throw new BadRequestError(ERROR_MESSAGES.USER_ID_MISSING);

    const favorites = await this._favoriteRepo.getAllFavoritesByUser(
      userId,
      page,
      limit
    );

    if (!favorites.length) return [];

    const userRes = await UserService.getUserById(userId, currentUserId);
    if (!userRes) throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);

    const user = userRes.data;

    const arts = await Promise.all(
      favorites.map(async (fav) => {
        const art = await this._artRepo.findById(fav.postId);
        if (!art) return null;

        const likeCount = await this._likeRepo.likeCountByPostId(art._id);
        const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
          art._id
        );
        const commentCount = await this._commentRepo.countByPostId(art._id);

        const isLiked =
          currentUserId &&
          (await this._likeRepo.findLike(art._id, currentUserId));
        const isFavorited =
          currentUserId &&
          (await this._favoriteRepo.findFavorite(art._id, currentUserId));

        return {
          ...toArtWithUserResponse(art, user),
          likeCount,
          favoriteCount,
          commentCount,
          isLiked: !!isLiked,
          isFavorited: !!isFavorited,
        };
      })
    );

    return arts.filter(Boolean);
  }
}
