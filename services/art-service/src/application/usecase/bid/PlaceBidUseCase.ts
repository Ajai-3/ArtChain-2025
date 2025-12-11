import { injectable, inject } from "inversify";
import { IPlaceBidUseCase } from "../../interface/usecase/bid/IPlaceBidUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { IWalletService } from "../../../domain/interfaces/IWalletService";
import { ISocketService } from "../../../domain/interfaces/ISocketService";
import { Bid } from "../../../domain/entities/Bid";
import { UserService } from "../../../infrastructure/service/UserService";
import { PlaceBidDTO } from "../../interface/dto/bid/PlaceBidDTO";
import { BidResponseDTO } from "../../interface/dto/bid/BidResponseDTO";
import { BidMapper } from "../../mapper/BidMapper";
import { NotFoundError, BadRequestError } from "art-chain-shared";
import { AUCTION_MESSAGES } from "../../../constants/AuctionMessages";
import { logger } from "../../../utils/logger";

@injectable()
export class PlaceBidUseCase implements IPlaceBidUseCase {
  constructor(
    @inject(TYPES.IBidRepository) private bidRepository: IBidRepository,
    @inject(TYPES.IAuctionRepository) private auctionRepository: IAuctionRepository,
    @inject(TYPES.IWalletService) private walletService: IWalletService,
    @inject(TYPES.ISocketService) private socketService: ISocketService
  ) {}

  async execute({ auctionId, bidderId, amount }: PlaceBidDTO): Promise<BidResponseDTO> {
    const auction = await this.auctionRepository.getById(auctionId);
    if (!auction) {
      throw new NotFoundError(AUCTION_MESSAGES.AUCTION_NOT_FOUND);
    }
    
    if (auction.status === "ENDED" || auction.status === "CANCELLED") {
        throw new BadRequestError(AUCTION_MESSAGES.AUCTION_NOT_ACTIVE);
    }

    if (auction.status === "SCHEDULED" && new Date() < new Date(auction.startTime)) {
        throw new BadRequestError(AUCTION_MESSAGES.AUCTION_NOT_STARTED);
    }

    if (amount <= auction.currentBid && auction.bids.length > 0) {
         throw new BadRequestError(`${AUCTION_MESSAGES.BID_TOO_LOW} ${auction.currentBid}`);
    }
    if (amount < auction.startPrice) {
         throw new BadRequestError(`${AUCTION_MESSAGES.BID_BELOW_START_PRICE} ${auction.startPrice}`);
    }
    
    const locked = await this.walletService.lockFunds(bidderId, amount, auctionId);
    if (!locked) {
        throw new BadRequestError(AUCTION_MESSAGES.FUNDS_LOCK_FAILED);
    }

    const currentHighest = await this.bidRepository.findHighestBid(auctionId);
    if (currentHighest) {
        await this.walletService.unlockFunds(currentHighest.bidderId, currentHighest.amount, auctionId);
    }

    const bidEntity = new Bid(auctionId, bidderId, amount); 
    const bid = await this.bidRepository.create(bidEntity);
    
    const newBids = auction.bids ? [...auction.bids] : [];
    if (bid._id) newBids.push(bid._id);

    const newStatus = auction.status === "SCHEDULED" ? "ACTIVE" : auction.status;

    await this.auctionRepository.update(auctionId, { 
        currentBid: amount, 
        winnerId: bidderId,
        bids: newBids,
        status: newStatus
    });

    let bidder = null;
    try {
        bidder = await UserService.getUserById(bidderId);
    } catch (error) {
        logger.error("Failed to fetch user details for bid socket event", error);
    }

    const bidDTO = BidMapper.toDTO(bid, bidder);

    this.socketService.publishBid(bidDTO);

    return bidDTO;
  }
}
