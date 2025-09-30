import { BadRequestError } from "art-chain-shared";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { IGetLikedUsersUseCase } from "../../interface/usecase/like/IGetLikedUsersUseCase";
import { UserService } from "../../../infrastructure/service/UserService";

export class GetLikedUsersUseCase implements IGetLikedUsersUseCase {
  constructor(private readonly _likeRepo: ILikeRepository) {}

  async execute(postId: string, page: number = 1, limit: number = 10) {
    if (!postId) {
      throw new BadRequestError("Post ID is required.");
    }

    const likes = await this._likeRepo.getAllLikesByPost(postId, page, limit);

      const userIds = likes.map(like => like.userId);

    const users = await UserService.getUsersByIds(userIds);


    const result = likes.map(like => {
      const user = users.find(u => u.id === like.userId);
      return {
        userId: like.userId,
        name: user.name,
        username: user?.username,
        profileImage: user?.profileImage,
        likedAt: like.createdAt,
      };
    });

    const likeCount = await this._likeRepo.likeCountByPostId(postId)

    return { users: result, likeCount };
  }
}
