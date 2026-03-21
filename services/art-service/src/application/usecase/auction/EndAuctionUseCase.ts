import { injectable, inject } from 'inversify';
import { IEndAuctionUseCase } from '../../interface/usecase/auction/IEndAuctionUseCase';
import { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';
import { IWalletService } from '../../../domain/interfaces/IWalletService';
import { ISocketService } from '../../../domain/interfaces/ISocketService';
import { IPlatformConfigRepository } from '../../../domain/repositories/IPlatformConfigRepository';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { logger } from '../../../utils/logger';
import { config } from '../../../infrastructure/config/env';

@injectable()
export class EndAuctionUseCase implements IEndAuctionUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository)
    private readonly _auctionRepository: IAuctionRepository,
    @inject(TYPES.IBidRepository)
    private readonly _bidRepository: IBidRepository,
    @inject(TYPES.IWalletService)
    private readonly _walletService: IWalletService,
    @inject(TYPES.ISocketService)
    private readonly _socketService: ISocketService,
    @inject(TYPES.IPlatformConfigRepository)
    private readonly _platformConfigRepository: IPlatformConfigRepository,
  ) {}

  async execute(auctionId: string): Promise<boolean> {
    logger.info(`Ending auction via UseCase: ${auctionId}`);

    // 1. Fetch Auction
    const auction = await this._auctionRepository.getById(auctionId);
    if (!auction) {
      logger.error(`Auction not found: ${auctionId}`);
      return false;
    }

    if (auction.status !== 'ACTIVE') {
      logger.warn(
        `Auction ${auctionId} is not active (Status: ${auction.status}). Skipping.`,
      );
      return false;
    }

    // 2. Fetch Highest Bid (Winner)
    const winningBid = await this._bidRepository.findHighestBid(auctionId);
    logger.info(`RAW winning bid: ${JSON.stringify(winningBid)}`);
    logger.info(
      `Amount: ${winningBid?.amount}, type: ${typeof winningBid?.amount}`,
    );

    if (winningBid) {
      // 3. Calculate Commission
      const platformConfig = await this._platformConfigRepository.getConfig();
      const commissionRate = platformConfig.auctionCommissionPercentage / 100;
      const totalAmount = winningBid.amount;
      const commissionAmount = totalAmount * commissionRate;

      // 4. Update Auction to PENDING payment
      await this._auctionRepository.update(auctionId, {
        paymentStatus: 'PENDING',
      });

      logger.info(
        `[EndAuctionUseCase] Attempting settlement for auction ${auctionId}. Winner: ${winningBid.bidderId}, Seller: ${auction.hostId}, Amount: ${totalAmount}`,
      );

      // 5. Settle Funds (External Service)
      const settlementSuccess = await this._walletService.settleAuction(
        winningBid.bidderId,
        auction.hostId,
        totalAmount,
        commissionAmount,
        auctionId,
      );

      logger.info(`[EndAuctionUseCase] Settlement result for ${auctionId}: ${settlementSuccess}`);

      if (settlementSuccess) {
        // 5. Success Flow
        if (winningBid._id) {
          await this._bidRepository.update(winningBid._id, { isWinner: true });
        }

        await this._auctionRepository.update(auctionId, {
          status: 'ENDED',
          winnerId: winningBid.bidderId,
          paymentStatus: 'SUCCESS',
        });

        this._socketService.publishAuctionEnded({
          auctionId,
          winnerId: winningBid.bidderId,
          winningBidAmount: winningBid.amount,
          status: 'ENDED',
        });

        logger.info(`[EndAuctionUseCase] Auction ${auctionId} settled and ended successfully.`);
      } else {
        // 6. Failure Flow
        logger.error(`[EndAuctionUseCase] Settlement FAILED for auction ${auctionId}. Marking paymentStatus as FAILED.`);
        
        await this._auctionRepository.update(auctionId, {
          status: 'ENDED', // Still ended because time is up
          winnerId: winningBid.bidderId,
          paymentStatus: 'FAILED',
        });

        this._socketService.publishAuctionEnded({
          auctionId,
          winnerId: winningBid.bidderId,
          winningBidAmount: winningBid.amount,
          status: 'ENDED',
        });

        return false;
      }
    } else {
      // No Bids
      await this._auctionRepository.update(auctionId, { status: 'UNSOLD' });
      this._socketService.publishAuctionEnded({
        auctionId,
        status: 'UNSOLD',
      });
      logger.info(`Auction ${auctionId} ended without bids.`);
    }

    return true;
  }
}
