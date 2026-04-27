import type { PostStatus, PostType, PriceType } from '../domain/entities/ArtPost';
import type { MongoLeanId } from './mongo';

export type ArtId = string;

export type ArtPostLean = {
  _id?: MongoLeanId;
  id?: string;
  userId: string;
  title: string;
  artName: string;
  description: string;
  artType: string;
  hashtags: string[];
  previewUrl: string;
  watermarkedUrl: string;
  aspectRatio: string;
  commentingDisabled: boolean;
  downloadingDisabled: boolean;
  isPrivate: boolean;
  isSensitive: boolean;
  isForSale: boolean;
  isSold: boolean;
  priceType?: PriceType;
  artcoins?: number;
  fiatPrice?: number | null;
  postType: PostType;
  status: PostStatus;
  category?: string;
  categoryId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

