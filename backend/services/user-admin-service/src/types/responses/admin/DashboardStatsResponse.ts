export interface DashboardStatsResponse {
  topArts: TopArtResponse[];
  categoryStats: CategoryStatResponse[];
  recentAuctions: RecentAuctionResponse[];
  recentCommissions: RecentCommissionResponse[];
  recentTransactions: RecentTransactionResponse[];
  userCounts: UserCountsResponse;
  artworkCounts: ArtworkCountsResponse;
  auctionCounts: AuctionCountsResponse;
  commissionCounts: CommissionCountsResponse;
  transactionStats: TransactionStatsResponse;
}

export interface TopArtResponse {
  id: string;
  title: string;
  imageUrl: string;
  likesCount: number;
  price: number;
  userId: string;
  previewUrl?: string;
  artist: {
    name: string;
    username: string;
    profileImage?: string;
  };
}

export interface CategoryStatResponse {
  category: string;
  count: number;
}

export interface RecentAuctionResponse {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  endTime: Date;
  hostId: string;
  imageKey?: string;
  host: {
    name: string;
    username: string;
    profileImage?: string;
  };
  startPrice: number;
}

export interface RecentCommissionResponse {
  id: string;
  amount: number;
  status: string;
  artistName: string;
  artistUsername?: string;
  artistProfileImage?: string | null;
  clientName: string;
  clientUsername?: string;
  clientProfileImage?: string | null;
  requestMessage: string;
  createdAt: string;
}

export interface RecentTransactionResponse {
  id?: string;
  amount: number;
  category: string;
  description: string;
  createdAt: Date;
  userId?: string;
  user?: {
    username: string;
    name: string;
    profileImage?: string;
  } | null;
}

export interface UserCountsResponse {
  total: number;
  users: number;
  artists: number;
  banned: number;
}

export interface ArtworkCountsResponse {
  total: number;
  free: number;
  premium: number;
  aiGenerated: number;
}

export interface AuctionCountsResponse {
  active: number;
  ended: number;
  sold: number;
  unsold: number;
}

export interface CommissionCountsResponse {
  REQUESTED?: number;
  AGREED?: number;
  IN_PROGRESS?: number;
  COMPLETED?: number;
  CANCELLED?: number;
  active?: number;
  ended?: number;
  sold?: number;
  unsold?: number;
}

export interface TransactionStatsResponse {
  totalAmount: number;
  transactionCount: number;
  byCategory: Record<string, number>;
}