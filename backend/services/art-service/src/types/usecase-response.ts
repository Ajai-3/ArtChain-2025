import type { UserPublicProfile } from './user';
import type { Category } from '../domain/entities/Category';
import type { Commission } from '../domain/entities/Commission';
import type { AIConfig } from '../domain/entities/AIConfig';

// Commission Use Cases
export interface UpdateCommissionInput {
  status?: string;
  budget?: number;
  deadline?: Date;
  title?: string;
  description?: string;
  referenceImages?: string[];
  finalArtwork?: string;
  disputeReason?: string;
}

export interface UpdateCommissionResponse {
  id: string;
  requesterId: string;
  artistId: string;
  conversationId: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: string;
  referenceImages: string[];
  finalArtwork?: string;
  finalImageUrl?: string;
  requesterAgreed: boolean;
  artistAgreed: boolean;
  history: { action: string; userId: string; timestamp: Date; details?: string }[];
  lastUpdatedBy?: string;
  amount?: number;
  platformFee?: number;
  deliveryDate?: Date;
  autoReleaseDate?: Date;
  disputeReason?: string;
  platformFeePercentage?: number;
  createdAt?: Date;
  updatedAt?: Date;
  requester: { id: string; name?: string; username?: string; profileImage?: string } | null;
  artist: { id: string; name?: string; username?: string; profileImage?: string } | null;
}

// AI Use Cases
export interface UpdateAIConfigInput {
  displayName?: string;
  enabled?: boolean;
  isFree?: boolean;
  dailyFreeLimit?: number;
  artcoinCostPerImage?: number;
  defaultModel?: string;
  availableModels?: string[];
  maxPromptLength?: number;
  allowedResolutions?: string[];
  maxImageCount?: number;
  defaultSteps?: number;
  defaultGuidanceScale?: number;
  priority?: number;
}

export interface UpdateAIConfigResponse {
  config: AIConfig;
}

export interface GetAIConfigsResponse {
  configs: AIConfig[];
}

// Admin Use Cases
export interface AdminArtMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetAllArtsResponse {
  data: unknown[];
  meta: AdminArtMeta;
}

// Commission Filter
export interface CommissionFilter {
  status?: string;
  requesterId?: string;
  artistId?: string;
}
export interface UnlikePostResponse {
  message: string;
}

export interface LikedUser {
  userId: string;
  name: string | undefined;
  username: string | undefined;
  profileImage: string | undefined;
  isSupporting: boolean | undefined;
  likedAt: Date | undefined;
}

export interface GetLikedUsersResponse {
  users: LikedUser[];
  likeCount: number;
}

export interface GetUserLikedArtsResponse {
  arts: unknown[];
  page: number;
  limit: number;
  total: number;
  length: number;
}

// Favorite Use Cases
export interface AddFavoriteResponse {
  message?: string;
}

export interface GetFavoritedUsersResponse {
  users: LikedUser[];
  favoriteCount: number;
}

// Commission Use Cases
export interface CreateCommissionResponse {
  id: string;
  requesterId: string;
  artistId: string;
  conversationId: string;
  title: string;
  description: string;
  budget: number;
  deadline: Date;
  status: string;
  referenceImages: string[];
  createdAt: Date;
}

export interface GetCommissionByConversationResponse {
  active: unknown;
  history: unknown[];
}

// Art Use Cases
export interface UpdateArtPostResponse {
  id: string;
  userId: string;
  title: string;
  artName: string;
  description: string;
  artType: string;
  hashtags: string[];
  previewUrl: string;
  watermarkedUrl: string;
  aspectRatio: string;
  isForSale: boolean;
  priceType?: string;
  artcoins?: number;
  fiatPrice?: number | null;
  postType: string;
  category: string;
  isSensitive: boolean;
  isPrivate: boolean;
  commentingDisabled: boolean;
  downloadingDisabled: boolean;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SaledArtworkItem {
  transactionId: string;
  purchaseDate: Date | string;
  amount: number;
  art: unknown;
  buyer: unknown | null;
}

export interface SaledArtworksResponse {
  sales: SaledArtworkItem[];
  length: number,
  total: number;
}

export interface PurchasedArtworkItem {
  transactionId: string;
  purchaseDate: Date | string;
  amount: number;
  art: unknown;
  seller: unknown | null;
}

export interface PurchasedArtworksResponse {
  purchases: PurchasedArtworkItem[];
  total: number;
}

export interface GetArtByNameResponse {
  art: {
    id: string;
    userId: string;
    title: string;
    artName: string;
    description: string;
    artType: string;
    hashtags: string[];
    imageUrl: string;
    aspectRatio: string;
    isForSale: boolean;
    isSold: boolean;
    priceType?: string;
    artcoins?: number;
    fiatPrice?: number | null;
    postType: string;
  };
  user: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
  } | null;
  isLiked: boolean;
  likeCount: number;
  isFavorited: boolean;
  commentCount: number;
  favoriteCount: number;
  category: Category | null;
  isPurchased: boolean;
}

export interface CreateArtPostResponse {
  id: string;
  userId: string;
  title: string;
  artName: string;
  description: string;
  artType: string;
  hashtags: string[];
  previewUrl: string;
  watermarkedUrl: string;
  aspectRatio: string;
  isForSale: boolean;
  priceType?: string;
  artcoins?: number;
  fiatPrice?: number | null;
  postType: string;
  category: string;
  isSensitive: boolean;
  isPrivate: boolean;
  commentingDisabled: boolean;
  downloadingDisabled: boolean;
  status: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// AI Use Cases
export interface CheckAIQuotaResponse {
  used: number;
  limit: number;
  remaining: number;
  resetAt: string;
}

export interface GetAIConfigsResponse {
  configs: AIConfig[];
}

export interface GenerateAIImageResponse {
  id: string;
  prompt: string;
  images: string[];
  isFree: boolean;
  cost: number;
  provider: string;
  model: string;
  createdAt: Date | undefined;
  remainingFreeGenerations: number;
}

export interface GetMyAIGenerationsResponse {
  generations: unknown[];
  total: number;
  page: number;
  limit: number;
}

// Admin Use Cases
export interface UpdateArtStatusResponse {
  message: string;
}

// Art to ElasticSearch
export interface ArtToElasticSearchInput {
  id: string;
  userId: string;
  title: string;
  artName: string;
  description: string;
  artType: string;
  hashtags: string[];
  previewUrl: string;
  watermarkedUrl: string;
  createdAt?: Date;
}

export interface ArtToElasticSearchResponse {
  success: boolean;
  art: ArtToElasticSearchInput;
}