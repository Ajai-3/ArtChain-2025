import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { LIKE_MESSAGES } from "../../../constants/LikeMessages";
import { UserService } from "../../../infrastructure/service/UserService";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { IGetLikedUsersUseCase } from "../../interface/usecase/like/IGetLikedUsersUseCase";

@injectable()
export class GetLikedUsersUseCase implements IGetLikedUsersUseCase {
  constructor(
    @inject(TYPES.ILikeRepository) private readonly _likeRepo: ILikeRepository
  ) {}

  async execute(
    currentUserId: string,
    postId: string,
    page: number = 1,
    limit: number = 10
  ) {
    if (!postId) {
      throw new BadRequestError(LIKE_MESSAGES.MISSING_POST_ID);
    }

    const likes = await this._likeRepo.getAllLikesByPost(postId, page, limit);

    const userIds = likes.map((like) => like.userId);

    const users = await UserService.getUsersByIds(userIds, currentUserId);

    const result = likes.map((like) => {
      const user = users.find((u) => u.id === like.userId);
      return {
        userId: like.userId,
        name: user.name,
        username: user?.username,
        profileImage: user?.profileImage,
        isSupporting: user.isSupporting,
        likedAt: like.createdAt,
      };
    });

    const likeCount = await this._likeRepo.likeCountByPostId(postId);

    return { users: result, likeCount };
  }
}
