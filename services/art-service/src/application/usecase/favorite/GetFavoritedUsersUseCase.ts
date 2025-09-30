import { BadRequestError } from "art-chain-shared";
import { IFavoriteRepository } from "../../../domain/repositories/IFavoriteRepository";
import { IGetFavoritedUsersUseCase } from "../../interface/usecase/favorite/IGetFavoritedUsersUseCase";
import { UserService } from "../../../infrastructure/service/UserService";

export class GetFavoritedUsersUseCase implements IGetFavoritedUsersUseCase {
  constructor(private readonly _favoriteRepository: IFavoriteRepository) {}

  async execute(postId: string, page: number = 1, limit: number = 10) {
    if (!postId) {
      throw new BadRequestError("Post ID is required.");
    }

    const favorites = await this._favoriteRepository.getAllFavoritesByPost(
      postId,
      page,
      limit
    );
      const userIds = favorites.map(fav => fav.userId);

    const users = await UserService.getUsersByIds(userIds);


    const result = favorites.map(fav => {
      const user = users.find(u => u.id === fav.userId);
      return {
        userId: fav.userId,
        name: user.name,
        username: user?.username,
        profileImage: user?.profileImage,
        favoritedAt: fav.createdAt,
      };
    });

    const favoriteCount = await this._favoriteRepository.favoriteCountByPostId(postId)

    return { users: result, favoriteCount };
  }
}
