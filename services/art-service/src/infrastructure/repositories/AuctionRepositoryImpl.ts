import { injectable } from "inversify";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { Auction } from "../../domain/entities/Auction";
import { AuctionModel } from "../models/AuctionModel";
import { IAuctionRepository } from "../../domain/repositories/IAuctionRepository";

@injectable()
export class AuctionRepositoryImpl extends BaseRepositoryImpl<Auction> implements IAuctionRepository {
  constructor() {
    super(AuctionModel);
  }

  async findByStatus(status: string): Promise<Auction[]> {
    return AuctionModel.find({ status }).sort({ createdAt: -1 }).lean() as unknown as Auction[];
  }

  async findByHostId(hostId: string): Promise<Auction[]> {
    return AuctionModel.find({ hostId }).sort({ createdAt: -1 }).lean() as unknown as Auction[];
  }

  async findActiveAuctions(page = 1, limit = 10): Promise<Auction[]> {
    return AuctionModel.find({ status: { $in: ['SCHEDULED', 'ACTIVE'] } })
      .sort({ status: 1, startTime: 1 }) // Active/Scheduled first
      .skip((page - 1) * limit)
      .limit(limit)
      .lean() as unknown as Auction[];
  }
}
