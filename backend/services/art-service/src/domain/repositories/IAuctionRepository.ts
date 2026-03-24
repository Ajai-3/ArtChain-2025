import { IBaseRepository } from './IBaseRepository';
import { Auction, AuctionStatus } from '../entities/Auction';

export interface IAuctionRepository extends IBaseRepository<Auction> {
  findByStatus(status: string): Promise<Auction[]>;
  findByHostId(hostId: string): Promise<Auction[]>;
  findRecent(limit: number): Promise<Auction[]>;
  findUserBiddingHistory(
    userId: string,
    page?: number, 
    limit?: number,
    status?: AuctionStatus
  ): Promise<Auction[]>;
  findActiveAuctions(
      page?: number, 
      limit?: number, 
      filterStatus?: string, 
      startDate?: Date,
      endDate?: Date,
      hostId?: string
    ): Promise<{ auctions: Auction[]; total: number }>;
  updateStatus(id: string, status: string): Promise<void>;
  getStats(startDate?: Date, endDate?: Date): Promise<{
    active: number;
    scheduled: number;
    ended: number;
    sold: number;
    unsold: number;
  }>;
}
