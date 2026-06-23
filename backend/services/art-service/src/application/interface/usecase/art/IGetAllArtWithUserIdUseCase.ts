import type { ArtWithUserResponse } from '../../../../types/art-mapper';

export type GetAllArtWithUserIdItem = ArtWithUserResponse & {
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  isFavorited: boolean;
  isLiked: boolean;
};

export interface IGetAllArtWithUserIdUseCase {
  execute(
    page: number,
    limit: number,
    userId: string,
    currentUserId: string
  ): Promise<GetAllArtWithUserIdItem[]>;
}
