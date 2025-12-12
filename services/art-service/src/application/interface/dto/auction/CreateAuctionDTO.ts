export interface CreateAuctionDTO {
  hostId: string;
  title: string;
  description: string;
  startPrice: number;
  startTime: Date;
  endTime: Date;
  imageKey: string;
}
