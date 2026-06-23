import type { ArtWithUserResponse, ArtPostLike } from './art-mapper';
import type { UserPublicProfile } from './user';
import type { Category } from '../domain/entities/Category';

export type GetAllArtItem = ArtWithUserResponse & {
  category: Category | null;
  isLiked: boolean;
  likeCount: number;
  isFavorited: boolean;
  commentCount: number;
  favoriteCount: number;
};

export type GetAllArtResponse = GetAllArtItem[];

export type IdMap<T extends { id: string }> = Map<string, T>;

export type UserMap = IdMap<UserPublicProfile>;
export type CategoryMap = Map<string, Category>;

export type ArtRecord = ArtPostLike;

