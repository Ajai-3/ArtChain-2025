import { injectable, inject } from "inversify";
import { IGetUserBidsUseCase } from "../../interface/usecase/bid/IGetUserBidsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { IS3Service } from "../../../domain/interfaces/IS3Service";
import { BidMapper } from "../../mapper/BidMapper";
import { UserBidResponseDTO } from "../../interface/dto/bid/UserBidResponseDTO";

@injectable()
export class GetUserBidsUseCase implements IGetUserBidsUseCase {
  constructor(
    @inject(TYPES.IBidRepository) private bidRepository: IBidRepository,
    @inject(TYPES.IAuctionRepository) private auctionRepository: IAuctionRepository,
    @inject(TYPES.IS3Service) private s3Service: IS3Service
  ) {}

  async execute(userId: string): Promise<UserBidResponseDTO[]> {
    const bids = await this.bidRepository.findByBidderId(userId);

    if (!bids.length) return [];

    const bidsWithAuctionDetails = await Promise.all(bids.map(async (bid) => {
        const auction = await this.auctionRepository.getById(bid.auctionId);
        if (!auction) return null;

        const signedImageUrl = await this.s3Service.getSignedUrl(auction.imageKey, 'bidding');
        
        return BidMapper.toUserBidDTO(bid, auction, signedImageUrl);
    }));

    return bidsWithAuctionDetails.filter((b): b is UserBidResponseDTO => b !== null);
  }
}
