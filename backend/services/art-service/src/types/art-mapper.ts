import type { UserPublicProfile } from './user';
import type { MongoLeanId } from './mongo';

export type ArtPostLike = {
  _id?: MongoLeanId;
  id?: string;
  userId: string;
  title: string;
  artName: string;
  description: string;
  artType: string;
  hashtags?: string[];
  aspectRatio?: string;
  commentingDisabled?: boolean;
  downloadingDisabled?: boolean;
  isPrivate?: boolean;
  isForSale?: boolean;
  isSold?: boolean;
  isSensitive?: boolean;
  postType?: string;
  status?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  previewUrl: string;
  watermarkedUrl: string;
  priceType?: string;
  artcoins?: number;
  fiatPrice?: number | null;
  category?: string;
  categoryId?: string;
};

export type PurchaseLike = {
  transactionId: string;
  purchaseDate: Date | string;
  amount: number;
};

export type ArtWithUserResponse = {
  user: Pick<
    UserPublicProfile,
    | 'id'
    | 'name'
    | 'username'
    | 'profileImage'
    | 'bannerImage'
    | 'role'
    | 'status'
    | 'isVerified'
    | 'plan'
    | 'supportersCount'
    | 'supportingCount'
    | 'isSupporting'
  >;
  art: {
    id: string;
    userId: string;
    title: string;
    artName: string;
    description: string;
    artType: string;
    hashtags?: string[];
    aspectRatio?: string;
    commentingDisabled?: boolean;
    downloadingDisabled?: boolean;
    isPrivate?: boolean;
    isForSale?: boolean;
    isSold?: boolean;
    isSensitive?: boolean;
    postType?: string;
    status?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    imageUrl: string;
  };
  price?: {
    type?: string;
    artcoins?: number;
    fiat?: number | null;
  };
  purchaser?: Pick<
    UserPublicProfile,
    'id' | 'name' | 'username' | 'profileImage' | 'role' | 'isVerified'
  >;
};

export type ArtWithUserForFavoriteResponse = {
  art: Pick<
    ArtPostLike,
    | 'id'
    | 'userId'
    | 'title'
    | 'artName'
    | 'description'
    | 'artType'
    | 'hashtags'
    | 'aspectRatio'
    | 'commentingDisabled'
    | 'downloadingDisabled'
    | 'isPrivate'
    | 'isSensitive'
    | 'isForSale'
    | 'priceType'
    | 'artcoins'
    | 'fiatPrice'
    | 'postType'
    | 'createdAt'
    | 'updatedAt'
  > & { id: string; imageUrl: string };
  user: Pick<UserPublicProfile, 'id' | 'name' | 'username' | 'profileImage'>;
};

export type UserFavoritedArtItem = ArtWithUserForFavoriteResponse & {
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  isLiked: boolean;
  isFavorited: boolean;
};

