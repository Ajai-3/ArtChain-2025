import { injectable } from 'inversify';
import { BaseRepositoryImpl } from './BaseRepositoryImpl';
import { Auction, AuctionStatus } from '../../domain/entities/Auction';
import { AuctionModel } from '../models/AuctionModel';
import { IAuctionRepository } from '../../domain/repositories/IAuctionRepository';

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

  async findUserBiddingHistory(
    userId: string,
    page = 1,
    limit = 10,
    status?: AuctionStatus
  ): Promise<Auction[]> {
    const query: any = {};

    if (status) {
      query.status = status;
    }

    return AuctionModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'bids', 
          localField: 'bids',
          foreignField: '_id',
          as: 'bidDetails'
        }
      },
      {
        $match: {
          'bidDetails.bidderId': userId
        }
      },
      { $sort: { createdAt: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);
  }


  async findRecent(limit: number): Promise<Auction[]> {
    return AuctionModel.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean() as unknown as Auction[];
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
        .sort({ createdAt: -1 })
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

  async getStats(startDate?: Date, endDate?: Date): Promise<{
    active: number;
    scheduled: number;
    ended: number;
    sold: number;
    unsold: number;
  }> {
    const query: any = {};
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = startDate;
      if (endDate) query.startTime.$lte = endDate;
    }

    const [active, scheduled, ended, sold, unsold] = await Promise.all([
      AuctionModel.countDocuments({ ...query, status: 'ACTIVE' }),
      AuctionModel.countDocuments({ ...query, status: 'SCHEDULED' }),
      AuctionModel.countDocuments({ ...query, status: 'ENDED' }),
      AuctionModel.countDocuments({ ...query, status: 'ENDED', winnerId: { $ne: null } }),
      AuctionModel.countDocuments({ ...query, status: 'ENDED', winnerId: null })
    ]);

    return { active, scheduled, ended, sold, unsold };
  }
}
