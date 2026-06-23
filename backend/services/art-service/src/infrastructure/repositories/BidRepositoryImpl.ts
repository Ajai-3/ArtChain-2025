import { injectable } from 'inversify';
import { BaseRepositoryImpl } from './BaseRepositoryImpl';
import { BidModel, BidDocument } from '../models/BidModel';
import { IBidRepository } from '../../domain/repositories/IBidRepository';
import { Bid } from '../../domain/entities/Bid';

@injectable()
export class BidRepositoryImpl extends BaseRepositoryImpl<Bid> implements IBidRepository {
  constructor() {
    super(BidModel);
  }

  async create(entity: unknown): Promise<Bid> {
    const doc = await BidModel.create(entity);
    return doc.toObject() as Bid;
  }

  async findByAuctionId(
    auctionId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ bids: Bid[]; total: number }> {
    const skip = (page - 1) * limit;
    const [bids, total] = await Promise.all([
      BidModel.find({ auctionId })
        .sort({ amount: -1 })
        .skip(skip)
        .limit(limit)
        .lean<Bid[]>(),
      BidModel.countDocuments({ auctionId }),
    ]);

    return {
      bids,
      total,
    };
  }

  async findHighestBid(auctionId: string): Promise<Bid | null> {
    return BidModel.findOne({ auctionId }).sort({ amount: -1 }).lean<Bid | null>();
  }

  async findByBidderId(bidderId: string): Promise<Bid[]> {
      return BidModel.find({ bidderId }).sort({ createdAt: -1 }).lean<Bid[]>();
  }
}
