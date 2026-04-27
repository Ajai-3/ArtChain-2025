import type { ArtPostLean } from './art';
import type { UserPublicProfile } from './user';

export type ShopArtByUserItem = {
  previewUrl: string;
  favoriteCount: number;
  user: UserPublicProfile;
} & ArtPostLean;

