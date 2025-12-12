import { IBaseRepository } from "./IBaseRepository";
import { Bid } from "../entities/Bid";

export interface IBidRepository extends IBaseRepository<Bid> {
  findByAuctionId(auctionId: string, page?: number, limit?: number): Promise<{ bids: Bid[]; total: number }>;
  findHighestBid(auctionId: string): Promise<Bid | null>;
  findByBidderId(bidderId: string): Promise<Bid[]>;
}
