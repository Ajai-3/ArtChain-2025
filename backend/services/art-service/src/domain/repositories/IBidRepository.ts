import { Bid } from '../entities/Bid';

export interface IBidRepository {
  create(entity: unknown): Promise<Bid>;
  getById(id: string): Promise<Bid | null>;
  getAll(page?: number, limit?: number): Promise<Bid[]>;
  update(id: string, entity: Record<string, unknown>): Promise<Bid>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  findByAuctionId(auctionId: string, page?: number, limit?: number): Promise<{ bids: Bid[]; total: number }>;
  findHighestBid(auctionId: string): Promise<Bid | null>;
  findByBidderId(bidderId: string): Promise<Bid[]>;
}
