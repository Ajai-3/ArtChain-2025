import type { UserFavoritedArtItem } from '../../../../types/art-mapper';

export interface IGetUserFavoritedArtsUseCase {
  execute(
    userId: string,
    currentUserId: string,
    page?: number,
    limit?: number
  ): Promise<UserFavoritedArtItem[]>;
}
