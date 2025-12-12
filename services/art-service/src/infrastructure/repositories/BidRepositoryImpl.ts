import { injectable } from "inversify";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { Bid } from "../../domain/entities/Bid";
import { BidModel } from "../models/BidModel";
import { IBidRepository } from "../../domain/repositories/IBidRepository";

@injectable()
export class BidRepositoryImpl extends BaseRepositoryImpl<Bid> implements IBidRepository {
  constructor() {
    super(BidModel);
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
        .lean(),
      BidModel.countDocuments({ auctionId }),
    ]);

    return {
      bids: bids as unknown as Bid[],
      total,
    };
  }

  async findHighestBid(auctionId: string): Promise<Bid | null> {
    return BidModel.findOne({ auctionId }).sort({ amount: -1 }).lean() as unknown as Bid | null;
  }

  async findByBidderId(bidderId: string): Promise<Bid[]> {
      return BidModel.find({ bidderId }).sort({ createdAt: -1 }).lean() as unknown as Bid[];
  }
}
