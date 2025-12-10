import { injectable, inject } from "inversify";
import { IPlaceBidUseCase } from "../../interface/usecase/bid/IPlaceBidUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { IWalletService } from "../../../domain/interfaces/IWalletService";
import { ISocketService } from "../../../domain/interfaces/ISocketService";
import { Bid } from "../../../domain/entities/Bid";

@injectable()
export class PlaceBidUseCase implements IPlaceBidUseCase {
  constructor(
    @inject(TYPES.IBidRepository) private bidRepository: IBidRepository,
    @inject(TYPES.IAuctionRepository) private auctionRepository: IAuctionRepository,
    @inject(TYPES.IWalletService) private walletService: IWalletService,
    @inject(TYPES.ISocketService) private socketService: ISocketService
  ) {}

  async execute(auctionId: string, bidderId: string, amount: number): Promise<Bid> {
    const auction = await this.auctionRepository.getById(auctionId);
    if (!auction) throw new Error("Auction not found");
    
    // Check Status
    if (auction.status === "ENDED" || auction.status === "CANCELLED") {
        throw new Error("Auction is not active");
    }

    // Check Start Time if SCHEDULED (Optional: Auto-start?)
    if (auction.status === "SCHEDULED" && new Date() < new Date(auction.startTime)) {
        throw new Error("Auction has not started yet");
    }

    if (amount <= auction.currentBid && auction.bids.length > 0) {
         throw new Error(`Bid amount must be higher than current bid ${auction.currentBid}`);
    }
    if (amount < auction.startPrice) {
         throw new Error(`Bid amount must be at least start price ${auction.startPrice}`);
    }
    
    // Lock funds
    const locked = await this.walletService.lockFunds(bidderId, amount, auctionId);
    if (!locked) {
        throw new Error("Failed to lock funds. Insufficient balance or wallet service error.");
    }

    // Refund previous highest bidder
    const currentHighest = await this.bidRepository.findHighestBid(auctionId);
    if (currentHighest) {
        await this.walletService.unlockFunds(currentHighest.bidderId, currentHighest.amount, auctionId);
    }

    // Create Bid
    // Note: passing undefined for createdAt and _id as they are optional/generated
    const bidEntity = new Bid(auctionId, bidderId, amount); 
    const bid = await this.bidRepository.create(bidEntity);
    
    // Update Auction
    const newBids = auction.bids ? [...auction.bids] : [];
    if (bid._id) newBids.push(bid._id); // Ensure _id is present

    // Implicitly set status to ACTIVE if it was SCHEDULED and valid bid placed
    const newStatus = auction.status === "SCHEDULED" ? "ACTIVE" : auction.status;

    await this.auctionRepository.update(auctionId, { 
        currentBid: amount, 
        winnerId: bidderId,
        bids: newBids,
        status: newStatus
    });

    this.socketService.publishBid({ ...bid, auctionId });

    return bid;
  }
}
