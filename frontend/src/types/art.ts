export interface UserResponse {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  bannerImage?: string;
  status: string;
  isVerified: boolean;
  plan: string;
  supportersCount: number;
  supportingCount: number;
  isSupporting: boolean;
}

export interface PriceResponse {
  type: string;
  artcoins?: number;
  fiat?: number;
}

export interface ArtResponse {
  id: string;
  userId: string;
  title: string;
  artName: string;
  description: string;
  artType: string;
  hashtags: string[];
  aspectRatio: string;
  commentingDisabled: boolean;
  downloadingDisabled: boolean;
  isPrivate: boolean;
  isForSale: boolean;
  isSold?: boolean;
  isSensitive: boolean;
  postType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

export interface ArtWithUserResponse {
  user: UserResponse;
  art: ArtResponse;
  price?: PriceResponse;
  purchaser?: UserResponse; // Added purchaser
  isLiked: boolean;
  likeCount: number;
  isFavorited: boolean;
  favoriteCount: number;
  commentCount: number;
}
