import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { Like } from "../../../domain/entities/Like";
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from "art-chain-shared";
import { ILikeUseCase } from "../../../domain/usecase/like/ILikeUseCase";
import { LIKE_MESSAGES } from "../../../constants/LikeMessages";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ART_MESSAGES } from "../../../constants/ArtMessages";
import { UserService } from "../../../infrastructure/service/UserService";
import { publishNotification } from "../../../infrastructure/rabbit/rabbit";

export class LikePostUseCase implements ILikeUseCase {
  constructor(
    private readonly _artRepo: IArtPostRepository,
    private readonly _likeRepository: ILikeRepository
  ) {}

  async execute(postId: string, userId: string) {
    if (!postId || !userId) {
      throw new BadRequestError(LIKE_MESSAGES.MISSING_USER_ID);
    }

    const post = await this._artRepo.findById(postId);

    if (!post) {
      throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
    }

    const existingLike = await this._likeRepository.findLike(postId, userId);
    if (existingLike) {
      throw new ConflictError(LIKE_MESSAGES.ALREADY_LIKED);
    }

    const like = new Like(postId, userId);

    const savedLike = await this._likeRepository.create(like);

    if (post.userId !== userId) {
      console.log(post.userId, userId);
      const userIds = [post.userId, userId];
      const users = await UserService.getUsersByIds(userIds);
      const userMap = new Map(users.map((u: any) => [u.id, u]));

      const likedUser = userMap.get(post.userId);
      const likerUser = userMap.get(userId);     

      if (likedUser && likerUser) {
        await publishNotification("like", {
          likedUserId: likedUser.id,
          likerId: likerUser.id,
          likerName: likerUser.username,
          likerProfile: likerUser.profileImage ?? null,
          createdAt: new Date().toISOString(),
        });
      }
    }

   

    return savedLike;
  }
}
