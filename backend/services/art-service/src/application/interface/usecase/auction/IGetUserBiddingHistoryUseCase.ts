import { AuctionStatus } from '../../../../domain/entities/Auction';

export type BiddingHistoryResponseItem = {
  auction: {
    id: string;
    title: string;
    description?: string;
    imageKey?: string;
    imageUrl: string | null;
    startTime: Date | string;
    endTime: Date | string;
    status: AuctionStatus;
    startPrice: number;
    currentBid?: number;
    winnerId?: string;
  };
  host: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
  } | null;
  winner: {
    id: string;
    name: string;
    username: string;
    profileImage: string;
  } | null;
};

export interface IGetUserBiddingHistoryUseCase {
  execute(userId: string, page?: number, limit?: number, status?: string): Promise<BiddingHistoryResponseItem[]>;
}