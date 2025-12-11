export interface Auction {
  id: string;
  title: string;
  description: string;
  imageKey: string;
  signedImageUrl?: string;
  currentBid: number;
  startPrice: number;
  startTime: string;
  endTime: string;
  status: "SCHEDULED" | "ACTIVE" | "ENDED" | "CANCELLED";
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

export interface Bid {
  id: string;
  amount: number;
  bidderId: string;
  createdAt: string;
  bidder?: {
      id: string;
      username: string;
      profileImage?: string;
      isVerified?: boolean;
      role?: string;
  }
}
