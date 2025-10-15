import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
import { TYPES } from "../../../infrastructure/invectify/types";
import { LIKE_MESSAGES } from "../../../constants/LikeMessages";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { IGetLikeCountUseCase } from "../../interface/usecase/like/IGetLikeCountUseCase";

@injectable()
export class GetLikeCountUseCase implements IGetLikeCountUseCase {
  constructor(
    @inject(TYPES.ILikeRepository)
    private readonly _likeRepository: ILikeRepository
  ) {}

  async execute(postId: string) {
    if (!postId) {
      throw new BadRequestError(LIKE_MESSAGES.MISSING_POST_ID);
    }

    const count = await this._likeRepository.likeCountByPostId(postId);
    return count;
  }
}
