export interface ArtTopItem {
  id: string;
  title: string;
  imageUrl: string;
  likesCount: number;
  price: number;
  userId: string;
  artistName?: string;
}

export interface CategoryStat {
  category: string;
  count: number;
}

export interface AuctionItem {
  id: string;
  title: string;
  imageUrl: string;
  currentBid: number;
  endTime: Date;
  hostId: string;
  hostName?: string;
}

export interface CommissionItem {
  id: string;
  title: string;
  imageUrl: string;
  status: string;
  requesterId: string;
  requesterName?: string;
  artistId: string;
  artistName?: string;
}

export interface ArtworkCountStats {
  total: number;
  free: number;
  premium: number;
  aiGenerated: number;
}

export interface AuctionCountStats {
  active: number;
  ended: number;
  sold: number;
  unsold: number;
  overall?: {
    active: number;
    ended: number;
    sold: number;
    unsold: number;
  };
}

export interface CommissionCountStats {
  REQUESTED: number;
  AGREED: number;
  IN_PROGRESS: number;
  COMPLETED: number;
  CANCELLED?: number;
  overall?: {
    REQUESTED: number;
    AGREED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
  };
}

export interface ArtComment {
  id: string;
  content: string;
  userId: string;
  artId: string;
  createdAt: Date;
}

export interface ArtUpdateStatusResponse {
  success: boolean;
  message?: string;
}

export interface CommentDeleteResponse {
  success: boolean;
  message?: string;
}