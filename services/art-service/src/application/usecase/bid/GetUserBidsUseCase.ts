import { injectable, inject } from "inversify";
import { IGetUserBidsUseCase } from "../../interface/usecase/bid/IGetUserBidsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { IS3Service } from "../../../domain/interfaces/IS3Service";
import { AuctionMapper } from "../../mapper/AuctionMapper";

@injectable()
export class GetUserBidsUseCase implements IGetUserBidsUseCase {
  constructor(
    @inject(TYPES.IBidRepository) private bidRepository: IBidRepository,
    @inject(TYPES.IAuctionRepository) private auctionRepository: IAuctionRepository,
    @inject(TYPES.IS3Service) private s3Service: IS3Service
  ) {}

  async execute(userId: string): Promise<any[]> {
    const bids = await this.bidRepository.findByBidderId(userId);

    if (!bids.length) return [];

    // We need to fetch details about each auction for these bids
    // Optimization: Unique auction IDs
    const auctionIds = [...new Set(bids.map(b => b.auctionId))];
    
    // Fetch auctions
    // Note: Repository likely needs findByIds, or we loop. 
    // AuctionRepository doesn't have batch get, so loop for now or add it.
    // Loop with Promise.all is okay for moderate history.
    
    const bidsWithAuctionDetails = await Promise.all(bids.map(async (bid) => {
        const auction = await this.auctionRepository.getById(bid.auctionId);
        if (!auction) return { ...bid, auction: null };

        const signedImageUrl = await this.s3Service.getSignedUrl(auction.imageKey, 'bidding');
        
        return {
            id: bid._id,
            amount: bid.amount,
            createdAt: bid.createdAt,
            auction: {
                id: auction._id,
                title: auction.title,
                status: auction.status,
                imageKey: signedImageUrl,
                endTime: auction.endTime
            }
        };
    }));

    return bidsWithAuctionDetails.filter(b => b.auction !== null);
  }
}
