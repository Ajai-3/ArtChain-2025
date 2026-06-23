import type { Auction, Bid } from './auction';

export interface AuctionListResponse {
  data: {
    auctions: Auction[];
    total: number;
  };
  page: number;
  limit: number;
  nextPage: number | null;
  hasNextPage: boolean;
}

export interface AuctionDetailResponse {
  auction: Auction;
}

export interface SettleAuctionResponse {
  message: string;
  auction: Auction;
}

export interface AdminAuctionData {
  _id: string;
  id: string;
  title: string;
  description: string;
  imageKey: string;
  signedImageUrl?: string;
  currentBid: number;
  startPrice: number;
  startTime: string;
  endTime: string;
  createdAt?: string;
  updatedAt?: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED' | 'UNSOLD';
  winnerId?: string;
  paymentStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'NONE';
  bids?: Bid[];
  host?: {
    id: string;
    username: string;
    name?: string;
    profileImage?: string;
    isVerified?: boolean;
    role?: string;
  };
  winner?: {
    id: string;
    username: string;
    name?: string;
    profileImage?: string;
    isVerified?: boolean;
    role?: string;
  };
}
