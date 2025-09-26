import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { IUnlikePostUseCase } from "../../../domain/usecase/like/IUnlikePostUseCase";
import { LIKE_MESSAGES } from "../../../constants/LikeMessages";
import { BadRequestError } from "art-chain-shared";

export class UnlikePostUseCase implements IUnlikePostUseCase {
  constructor(private readonly _likeRepository: ILikeRepository) {}

  async execute(postId: string, userId: string) {
    if (!postId || !userId) {
      throw new BadRequestError(LIKE_MESSAGES.MISSING_USER_ID);
    }

    const existingLike = await this._likeRepository.findLike(postId, userId);
    console.log(existingLike)
    if (!existingLike) {
      throw new BadRequestError(LIKE_MESSAGES.CANNOT_UNLIKE_THE_POST);
    }

    await this._likeRepository.deleteLike(postId, userId);
    return { message: LIKE_MESSAGES.UNLIKE_SUCCESS };
  }
}