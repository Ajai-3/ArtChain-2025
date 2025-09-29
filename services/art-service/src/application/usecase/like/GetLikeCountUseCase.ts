import { BadRequestError } from "art-chain-shared";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { IGetLikeCountUseCase } from "../../interface/usecase/like/IGetLikeCountUseCase";
import { LIKE_MESSAGES } from "../../../constants/LikeMessages";

export class GetLikeCountUseCase implements IGetLikeCountUseCase {
  constructor(private readonly _likeRepository: ILikeRepository) {}

  async execute(postId: string) {
    if (!postId) {
      throw new BadRequestError("Post ID is required.");
    }

    const count = await this._likeRepository.likeCountByPostId(postId)
    return count
  }
}