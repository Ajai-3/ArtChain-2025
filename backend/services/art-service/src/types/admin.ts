import type { ArtPostLean } from './art';
import type { UserPublicProfile } from './user';

export type AdminArtCounts = {
  likes: number;
  comments: number;
  favorites: number;
  downloads: number
};

export type AdminArtListItem = {
  id: string;
  artName?: string;
  title?: string;
  description?: string;
  postType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  priceType?: string;
  artcoins?: number;
  fiatPrice?: number | null;
  previewUrl: string;
  user: {
    name: string;
    username: string;
    profileImage: string;
  };
  counts: {
    likes: number;
    comments: number;
    favorites: number;
    downloads: number;
  };
};

export type AdminArtMapperInput = {
  art: Partial<ArtPostLean> & { id?: string; previewUrl: string; downloads?: number };
  user: Partial<UserPublicProfile> | null;
  counts: Partial<AdminArtCounts>;
};

