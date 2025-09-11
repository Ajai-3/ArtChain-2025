import { IArtPostRepository } from "../../../domain/repositories/IArtPostRepository";
import { ArtPost } from "../../../domain/entities/ArtPost";
import { IGetAllArtUseCase } from "../../../domain/usecase/art/IGetAllArtUseCase";
import { UserService } from "../../../infrastructure/service/UserService";

export class GetAllArtUseCase implements IGetAllArtUseCase {
  constructor(private readonly _artRepo: IArtPostRepository) {}

  async execute(page: number, limit: number): Promise<any[]> {
    const arts = await this._artRepo.getAllArt(page, limit);

    if (!arts.length) return [];


    const userIdsSet = new Set<string>();
    for (const art of arts) {
      if (typeof art.userId === "string") {
        userIdsSet.add(art.userId);
      }
    }
    const userIds: string[] = Array.from(userIdsSet);
    console.log(userIds)

    const users = await UserService.getUsersByIds(userIds);
    console.log(users)

    const userMap = new Map(users.map((u: any) => [u.id, u]));

    return arts.map((art: ArtPost) => ({
      art,
      user: userMap.get(art.userId) || null,
    }));
  }
}
