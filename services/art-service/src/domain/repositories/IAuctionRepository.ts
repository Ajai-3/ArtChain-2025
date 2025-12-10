import { IBaseRepository } from "./IBaseRepository";
import { Auction } from "../entities/Auction";

export interface IAuctionRepository extends IBaseRepository<Auction> {
  findByStatus(status: string): Promise<Auction[]>;
  findByHostId(hostId: string): Promise<Auction[]>;
  findActiveAuctions(page?: number, limit?: number): Promise<Auction[]>;
}
