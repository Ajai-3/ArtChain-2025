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
    } else if (!hostId && filterStatus !== 'ALL') {
        // Only default to excluding CANCELLED if 'ALL' wasn't explicitly requested
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

  async getStats(): Promise<{ total: number; active: number; scheduled: number; ended: number; cancelled: number }> {
    const stats = await AuctionModel.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const result = {
      total: 0,
      active: 0,
      scheduled: 0,
      ended: 0,
      cancelled: 0
    };

    stats.forEach((stat: any) => {
      const count = stat.count;
      result.total += count;
      if (stat._id === 'ACTIVE') result.active = count;
      if (stat._id === 'SCHEDULED') result.scheduled = count;
      if (stat._id === 'ENDED') result.ended = count;
      if (stat._id === 'CANCELLED') result.cancelled = count;
    });

    return result;
  }
}
