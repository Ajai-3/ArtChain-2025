import { IBaseRepository } from "./IBaseRepository";
import { Auction } from "../entities/Auction";

export interface IAuctionRepository extends IBaseRepository<Auction> {
  findByStatus(status: string): Promise<Auction[]>;
  findByHostId(hostId: string): Promise<Auction[]>;
  findActiveAuctions(
      page?: number, 
      limit?: number, 
      filterStatus?: string, 
      startDate?: Date,
      endDate?: Date
    ): Promise<Auction[]>;
  updateStatus(id: string, status: string): Promise<void>;
}
