import { injectable, inject } from "inversify";
import { IEndAuctionUseCase } from "../../interface/usecase/auction/IEndAuctionUseCase";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { IWalletService } from "../../../domain/interfaces/IWalletService";
import { ISocketService } from "../../../domain/interfaces/ISocketService";
import { IPlatformConfigRepository } from "../../../domain/repositories/IPlatformConfigRepository";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { logger } from "../../../utils/logger";
import { config } from "../../../infrastructure/config/env";

@injectable()
export class EndAuctionUseCase implements IEndAuctionUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository) private readonly _auctionRepository: IAuctionRepository,
    @inject(TYPES.IBidRepository) private readonly _bidRepository: IBidRepository,
    @inject(TYPES.IWalletService) private readonly _walletService: IWalletService,
    @inject(TYPES.ISocketService) private readonly _socketService: ISocketService,
    @inject(TYPES.IPlatformConfigRepository) private readonly _platformConfigRepository: IPlatformConfigRepository
  ) {}

  async execute(auctionId: string): Promise<boolean> {
    logger.info(`Ending auction via UseCase: ${auctionId}`);
    
    // 1. Fetch Auction
    const auction = await this._auctionRepository.getById(auctionId);
    if (!auction) {
        logger.error(`Auction not found: ${auctionId}`);
        return false;
    }

    if (auction.status !== "ACTIVE") {
        logger.warn(`Auction ${auctionId} is not active (Status: ${auction.status}). Skipping.`);
        return false; 
    }

    // 2. Fetch Highest Bid (Winner)
    const winningBid = await this._bidRepository.findHighestBid(auctionId);
    
    if (winningBid) {
        // 3. Calculate Commission
        const platformConfig = await this._platformConfigRepository.getConfig();
        const commissionRate = platformConfig.auctionCommissionPercentage / 100;
        const totalAmount = winningBid.amount;
        const commissionAmount = totalAmount * commissionRate;
        
        // 4. Settle Funds
        // 4. Settle Funds
        // Use Platform Admin ID from config
        const adminId = config.platform_admin_id; 

        // We use hostId as sellerId
        const settlementSuccess = await this._walletService.settleAuction(
            winningBid.bidderId,
            auction.hostId,
            adminId,
            totalAmount,
            commissionAmount,
            auctionId
        );

        if (settlementSuccess) {
            // 5. Update Auction Status
            await this._auctionRepository.update(auctionId, {
                status: "ENDED",
                winnerId: winningBid.bidderId
            });
            
            // 6. Notify
            this._socketService.publishAuctionEnded({
                auctionId,
                winnerId: winningBid.bidderId,
                winningBidAmount: winningBid.amount,
                status: "ENDED"
            });
            logger.info(`Auction ${auctionId} settled successfully. Winner: ${winningBid.bidderId}`);
        } else {
             logger.error(`Failed to settle funds for auction ${auctionId}. Auction status remains ACTIVE.`);
             return false;
        }

    } else {
        // No Bids
        await this._auctionRepository.update(auctionId, { status: "UNSOLD" }); // Use correct status enum if existing
         this._socketService.publishAuctionEnded({
                auctionId,
                status: "UNSOLD"
            });
        logger.info(`Auction ${auctionId} ended without bids.`);
    }

    return true;
  }
}
