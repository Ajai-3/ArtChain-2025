import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { Like } from "../../../domain/entities/Like";
import { ConflictError, BadRequestError } from "art-chain-shared";
import { ILikeUseCase } from "../../../domain/usecase/like/ILikeUseCase";
import { LIKE_MESSAGES } from "../../../constants/LikeMessages";

export class LikePostUseCase implements ILikeUseCase {
  constructor(private readonly _likeRepository: ILikeRepository) {}

  async execute(postId: string, userId: string) {
    if (!postId || !userId) {
      throw new BadRequestError(LIKE_MESSAGES.MISSING_USER_ID);
    }

    const existingLike = await this._likeRepository.findLike(postId, userId);
    if (existingLike) {
      throw new ConflictError(LIKE_MESSAGES.ALREADY_LIKED);
    }

    const like = new Like(postId, userId);
    return await this._likeRepository.create(like);
  }
}
