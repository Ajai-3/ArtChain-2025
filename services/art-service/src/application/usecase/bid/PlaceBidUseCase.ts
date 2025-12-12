
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
    @inject(TYPES.IBidRepository) private readonly _bidRepository: IBidRepository,
    @inject(TYPES.IAuctionRepository) private readonly _auctionRepository: IAuctionRepository,
    @inject(TYPES.IWalletService) private readonly _walletService: IWalletService,
    @inject(TYPES.ISocketService) private readonly _socketService: ISocketService
  ) {}

  async execute({ auctionId, bidderId, amount, bidderUserInfo }: PlaceBidDTO): Promise<BidResponseDTO> {
    const auction = await this._auctionRepository.getById(auctionId);
    if (!auction) {
      throw new NotFoundError(AUCTION_MESSAGES.AUCTION_NOT_FOUND);
    }
    
    // 1. Validate Auction Status
    const now = new Date();
    if (auction.status === "ENDED" || auction.status === "CANCELLED" || 
       (auction.status === "ACTIVE" && now > new Date(auction.endTime))) {
        throw new BadRequestError(AUCTION_MESSAGES.AUCTION_NOT_ACTIVE);
    }

    if (auction.status === "SCHEDULED" && now < new Date(auction.startTime)) {
        throw new BadRequestError(AUCTION_MESSAGES.AUCTION_NOT_STARTED);
    }

    const currentHighestBid = await this._bidRepository.findHighestBid(auctionId);
    const currentMaxAmount = currentHighestBid ? currentHighestBid.amount : auction.startPrice;

    // 2. Validate Bid Amount
    // Must be strictly higher than current highest or >= startPrice if no bids
    if (amount <= currentMaxAmount && (currentHighestBid || amount < auction.startPrice)) {
       throw new BadRequestError("Bid must be higher than current highest bid.");
    }
    
    // 3. Determine Lock Amount & Previous Winner Handling
    let amountToLock = amount;
    let shouldUnlockPrevious = false;
    let previousBidderId: string | null = null;
    let previousAmount = 0;

    if (currentHighestBid) {
        if (currentHighestBid.bidderId === bidderId) {
            // Self-Outbid: Only lock the difference
            amountToLock = amount - currentHighestBid.amount;
        } else {
            // Outbidding someone else: Lock full new amount, unlock previous later
            shouldUnlockPrevious = true;
            previousBidderId = currentHighestBid.bidderId;
            previousAmount = currentHighestBid.amount;
        }
    }

    if (amountToLock <= 0) {
        throw new BadRequestError("Invalid bid increment.");
    }

    // 4. Lock Funds (External Service)
    const locked = await this._walletService.lockFunds(bidderId, amountToLock, auctionId);
    if (!locked) {
        throw new BadRequestError(AUCTION_MESSAGES.FUNDS_LOCK_FAILED);
    }

    try {
        // 5. Create Bid & Update Auction (DB Transaction scope ideally)
        const bidEntity = new Bid(auctionId, bidderId, amount); 
        const bid = await this._bidRepository.create(bidEntity);
        
        const newBids = auction.bids ? [...auction.bids] : [];
        if (bid._id) newBids.push(bid._id);

        const newStatus = auction.status === "SCHEDULED" ? "ACTIVE" : auction.status;

        await this._auctionRepository.update(auctionId, { 
            currentBid: amount, 
            winnerId: bidderId,
            bids: newBids,
            status: newStatus
        });

        // 6. Unlock Previous Bidder (Compensation for outbid user)
        if (shouldUnlockPrevious && previousBidderId) {
            // We do not await this or let it fail the main request, but log reliable failure
            this._walletService.unlockFunds(previousBidderId, previousAmount, auctionId)
                .catch(err => logger.error(`Failed to unlock funds for outbid user ${previousBidderId}`, err));
        }

        // 7. Socket Broadcast
        let bidder = bidderUserInfo || null;
        
        if (!bidder) {
            try {
                bidder = await UserService.getUserById(bidderId);
            } catch (error) {
                logger.error("Failed to fetch user details for bid socket event", error);
            }
        }

        console.log(bidder, bid)

        const bidDTO = BidMapper.toDTO(bid, bidder);

        console.log(bidDTO)
        
        this._socketService.publishBid(bidDTO);
        console.log(`📢 [PlaceBidUseCase] Published bid_placed event for auction ${auctionId}`);

        return bidDTO;

    } catch (dbError) {
        // Compensation: Unlock the funds we just locked if DB fails
        logger.error("DB Error during bid placement, rolling back funds lock", dbError);
        await this._walletService.unlockFunds(bidderId, amountToLock, auctionId);
        throw dbError;
    }
  }
}
