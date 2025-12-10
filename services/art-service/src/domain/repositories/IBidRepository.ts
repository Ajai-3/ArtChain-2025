import { IBaseRepository } from "./IBaseRepository";
import { Bid } from "../entities/Bid";

export interface IBidRepository extends IBaseRepository<Bid> {
  findByAuctionId(auctionId: string): Promise<Bid[]>;
  findHighestBid(auctionId: string): Promise<Bid | null>;
  findByBidderId(bidderId: string): Promise<Bid[]>;
}
