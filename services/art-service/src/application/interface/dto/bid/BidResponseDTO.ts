export interface BidResponseDTO {
  id: string;
  auctionId: string;
  amount: number;
  createdAt: Date;
  bidder: {
    id: string;
    username: string;
    name: string;
    profileImage: string;
    isVerified: boolean;
  } | null;
}
