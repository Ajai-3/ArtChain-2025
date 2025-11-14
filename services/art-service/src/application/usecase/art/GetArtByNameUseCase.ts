import { IArtPostRepository } from "./../../../domain/repositories/IArtPostRepository";
import { inject, injectable } from "inversify";
import { ART_MESSAGES } from "../../../constants/ArtMessages";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ERROR_MESSAGES, NotFoundError } from "art-chain-shared";
import { UserService } from "../../../infrastructure/service/UserService";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IGetArtByNameUseCase } from "../../interface/usecase/art/IGetArtByNameUseCase";

@injectable()
export class GetArtByNameUseCase implements IGetArtByNameUseCase {
  constructor(
    @inject(TYPES.IArtPostRepository)
    private readonly _artRepo: IArtPostRepository,
    @inject(TYPES.ILikeRepository) private readonly _likeRepo: ILikeRepository,
    @inject(TYPES.ICommentRepository)
    private readonly _commentRepo: ICommentRepository,
    @inject(TYPES.IFavoriteRepository)
    private readonly _favoriteRepo: IFavoriteRepository
  ) {}

  async execute(artName: string, currentUserId: string) {
    const artFull = await this._artRepo.findByArtName(artName);
    if (!artFull) {
      throw new NotFoundError(ART_MESSAGES.ART_NOT_FOUND);
    }

    const userRes = await UserService.getUserById(
      artFull.userId,
      currentUserId
    );
    if (!userRes) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const likeCount = await this._likeRepo.likeCountByPostId(artFull._id);
    const favoriteCount = await this._favoriteRepo.favoriteCountByPostId(
      artFull._id
    );
    const commentCount = await this._commentRepo.countByPostId(artFull._id);

    const isLiked = !!(
      currentUserId &&
      (await this._likeRepo.findLike(artFull._id, currentUserId))
    );
    const isFavorited = !!(
      currentUserId &&
      (await this._favoriteRepo.findFavorite(artFull._id, currentUserId))
    );

    return {
      ...toArtWithUserResponse(artFull, userRes.data),
      isLiked,
      likeCount,
      isFavorited,
      commentCount,
      favoriteCount,
    };
  }
}
