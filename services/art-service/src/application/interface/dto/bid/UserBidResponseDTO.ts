export interface UserBidResponseDTO {
  id: string;
  amount: number;
  createdAt: Date;
  auction: {
    id: string;
    title: string;
    status: string;
    imageKey: string;
    endTime: Date;
  } | null;
}
