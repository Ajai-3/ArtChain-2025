import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ArtPost } from "../../../domain/entities/ArtPost";
import { IGetAllArtUseCase } from "../../../domain/usecase/art/IGetAllArtUseCase";
import { UserService } from "../../../infrastructure/service/UserService";
import { toArtWithUserResponse } from "../../../utils/mappers/artWithUserMapper";
import { ILikeRepository } from "../../../domain/repositories/ILikeRepository";
import { ICommentRepository } from "../../../domain/repositories/ICommentRepository";

export class GetAllArtUseCase implements IGetAllArtUseCase {
  constructor(
    private readonly _artRepo: IArtPostRepository,
    private readonly _likeRepo: ILikeRepository,
    private readonly _commentRepo: ICommentRepository
  ) {}

  async execute(
    page: number,
    limit: number,
    currentUserId: string
  ): Promise<any[]> {
    const arts = await this._artRepo.getAllArt(page, limit);

    if (!arts.length) return [];

    const userIdsSet = new Set<string>();
    for (const art of arts) {
      if (typeof art.userId === "string") {
        userIdsSet.add(art.userId);
      }
    }
    const userIds: string[] = Array.from(userIdsSet);
    console.log(userIds);

    const users = await UserService.getUsersByIds(userIds);
    console.log(users);

    const userMap = new Map(users.map((u: any) => [u.id, u]));

    return await Promise.all(
      arts.map(async (art: any) => {
        const userData = userMap.get(art.userId) || null;

        const likeCount = await this._likeRepo.likeCountByPostId(art._id);
        const commentCount = await this._commentRepo.countByPostId(art._id);
        const isLiked = !!(
          currentUserId &&
          (await this._likeRepo.findLike(art._id, currentUserId))
        );

        return {
          ...toArtWithUserResponse(art, userData),
          likeCount,
          commentCount,
          isLiked,
        };
      })
    );
  }
}
