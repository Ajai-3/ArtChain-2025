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

  async findActiveAuctions(
      page = 1, 
      limit = 10,
      filterStatus?: string,
      startDate?: Date,
      endDate?: Date,
      hostId?: string
    ): Promise<{ auctions: Auction[]; total: number }> {
    
    const query: any = {};
    
    if (hostId) {
        query.hostId = hostId;
    }
    
    if (filterStatus && filterStatus !== 'ALL') {
        query.status = filterStatus;
    } else if (!hostId) {
        query.status = { $in: ['SCHEDULED', 'ACTIVE', 'ENDED'] };
    }

    if (!filterStatus && hostId) {
         query.status = { $in: ['SCHEDULED', 'ACTIVE', 'ENDED'] };
    }

    if (startDate || endDate) {
        query.startTime = {};
        if (startDate) query.startTime.$gte = startDate;
        if (endDate) query.startTime.$lte = endDate;
    }

    const [auctions, total] = await Promise.all([
        AuctionModel.find(query)
            .sort({ status: 1, startTime: 1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean() as unknown as Auction[],
        AuctionModel.countDocuments(query)
    ]);

    return { auctions, total };
  }

  async updateStatus(id: string, status: string): Promise<void> {
      await AuctionModel.updateOne({ _id: id }, { status });
  }
}
