export interface PlaceBidDTO {
  auctionId: string;
  bidderId: string;
  amount: number;
  bidderUserInfo?: {
    id: string;
    username: string;
    profileImage?: string;
    name?: string;
  };  
}
