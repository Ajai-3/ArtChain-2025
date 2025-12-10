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

  async findByAuctionId(auctionId: string): Promise<Bid[]> {
    return BidModel.find({ auctionId }).sort({ amount: -1 }).lean() as unknown as Bid[];
  }

  async findHighestBid(auctionId: string): Promise<Bid | null> {
    return BidModel.findOne({ auctionId }).sort({ amount: -1 }).lean() as unknown as Bid | null;
  }

  async findByBidderId(bidderId: string): Promise<Bid[]> {
      return BidModel.find({ bidderId }).sort({ createdAt: -1 }).lean() as unknown as Bid[];
  }
}
