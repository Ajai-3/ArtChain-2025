export interface ShopItem {
  id: string;
  title: string;
  artName: string;
  previewUrl: string;
  imageKey?: string;
  artType: string;
  priceType: 'artcoin' | 'fiat' | 'free';
  artcoins: number;
  fiatPrice?: number;
  status: string;
  favoriteCount: number;
  likeCount?: number;
  commentCount?: number;
  user?: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  createdAt?: string;
}

export interface ArtItem {
  id: string;
  userId: string;
  title: string;
  artName: string;
  previewUrl?: string;
  imageUrl?: string;
  imageKey?: string;
  description?: string;
  artType: string;
  hashtags?: string[];
  aspectRatio?: string;
  commentingDisabled?: boolean;
  downloadingDisabled?: boolean;
  isPrivate?: boolean;
  isForSale?: boolean;
  isSold?: boolean;
  priceType?: 'artcoin' | 'fiat' | 'free';
  artcoins?: number;
  fiatPrice?: number;
  postType?: string;
  status: string;
  liked?: boolean;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  user?: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ArtWithUser extends ArtItem {
  art?: {
    id: string;
    artName?: string;
    title?: string;
    imageUrl?: string;
  };
}

export interface BidItem {
  id: string;
  amount: number;
  bidderId: string;
  auctionId: string;
  createdAt: string;
  bidder?: {
    id: string;
    username: string;
    name?: string;
    profileImage?: string;
    isVerified?: boolean;
    role?: string;
  };
}

export interface AuctionItem {
  id: string;
  title: string;
  description: string;
  imageKey: string;
  previewUrl?: string;
  signedImageUrl?: string;
  currentBid: number;
  startPrice: number;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED' | 'UNSOLD';
  winnerId?: string;
  hostId?: string;
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'NONE';
  bids?: BidItem[];
  bidCount?: number;
  host?: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
    isVerified?: boolean;
    role?: string;
  };
  winner?: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
    isVerified?: boolean;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface AnalyticsData {
  totalAmount?: number;
  count?: number;
  date?: string;
  totalSales?: number;
  totalPurchases?: number;
}

export interface SalesAnalytics {
  totalAmount: number;
  count: number;
  date: string;
}

export interface PurchasedAnalytics {
  totalAmount: number;
  count: number;
  date: string;
}

export interface SalesData {
  id: string;
  artName: string;
  previewUrl: string;
  price: number;
  buyerName: string;
  buyerUsername: string;
  createdAt: string;
}

export interface PurchasedArt {
  transactionId: string;
  id?: string;
  artId?: string;
  artName?: string;
  previewUrl?: string;
  imageUrl?: string;
  price?: number;
  amount?: number;
  purchaseDate?: string;
  createdAt?: string;
  seller?: {
    id: string;
    username?: string;
    name?: string;
    profileImage?: string;
  };
  art?: {
    id?: string;
    artName?: string;
    title?: string;
    imageUrl?: string;
  };
  sellerUsername?: string;
  sellerName?: string;
}

export interface CommissionItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  budget?: number;
  deadline?: string;
  creator?: {
    id: string;
    name?: string;
    username?: string;
    profileImage?: string;
  };
  artist?: {
    id: string;
    name?: string;
    username?: string;
    profileImage?: string;
  };
  createdAt?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  sender?: {
    id: string;
    name?: string;
    username?: string;
    profileImage?: string;
  };
  createdAt?: string;
}

export interface PaginationPage<T> {
  data: T[];
  page: number;
  hasNextPage?: boolean;
}

export type PaginatedShopResponse = {
  success: boolean;
  data: ShopItem[];
  page: number;
  limit: number;
  hasNextPage?: boolean;
  total?: number;
};

export type PaginatedArtResponse = {
  success: boolean;
  data: ArtItem[];
  page: number;
  limit: number;
  hasNextPage?: boolean;
  total?: number;
};

export type PaginatedAuctionResponse = {
  success: boolean;
  data: AuctionItem[];
  page: number;
  limit: number;
  hasNextPage?: boolean;
  total?: number;
};
