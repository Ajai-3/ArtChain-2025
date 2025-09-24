import { ERROR_MESSAGES, NotFoundError } from "art-chain-shared";
import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { IGetArtByNameUseCase } from "../../../domain/usecase/art/IGetArtByNameUseCase";
import { UserService } from "../../../infrastructure/service/UserService";
import { ART_MESSAGES } from "../../../constants/ArtMessages";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";

export class GetArtByNameUseCase implements IGetArtByNameUseCase {
  constructor(
    private readonly _artRepo: IArtPostRepository,
    private readonly _likeRepo: ILikeRepository,
    private readonly _commentRepo: ICommentRepository
  ) {}

  async execute(artName: string, currentUserId: string) {

    const artFull = await this._artRepo.findByArtName(artName);
    if (!artFull) {
      throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
    }

    const userRes = await UserService.getUserById(artFull.userId, currentUserId);
    if (!userRes) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const likeCount = await this._likeRepo.likeCountByPostId(artFull._id);
    const commentCount = await this._commentRepo.countByPostId(artFull._id);

     const isLiked = !!(currentUserId && (await this._likeRepo.findLike(artFull._id, currentUserId)));

    return {
      ...toArtWithUserResponse(artFull, userRes.data),
      isLiked,
      likeCount,
      commentCount,
    };
  }
}
