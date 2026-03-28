import { injectable, inject } from 'inversify';
import { logger } from '../../../utils/logger';
import { ILogger } from '../../interface/ILogger';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IWalletService } from '../../../domain/interfaces/IWalletService';
import { ISocketService } from '../../../domain/interfaces/ISocketService';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';
import { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import { IEndAuctionUseCase } from '../../interface/usecase/auction/IEndAuctionUseCase';
import { IPlatformConfigRepository } from '../../../domain/repositories/IPlatformConfigRepository';

@injectable()
export class EndAuctionUseCase implements IEndAuctionUseCase {
  constructor(
    @inject(TYPES.ILogger)
    private readonly _logger: ILogger,
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
  ) { }

  async execute(auctionId: string): Promise<boolean> {
    this._logger.info(`Attempting to close auction: ${auctionId}`);

    const auction = await this._auctionRepository.getById(auctionId);

    if (!auction) {
      this._logger.error(`Auction ${auctionId} not found.`);
      return false;
    }

    if (auction.status === 'CANCELLED' || auction.status === 'UNSOLD') {
      return false;
    }

    const now = new Date();
    if (now < new Date(auction.endTime)) {
      this._logger.warn(`Auction ${auctionId} has not ended yet.`);
      return false;
    }

    if (auction.paymentStatus === 'SUCCESS') {
      this._logger.info(`Auction ${auctionId} payment already SUCCESS. Skipping.`);
      return true;
    }


    const winningBid = await this._bidRepository.findHighestBid(auctionId);

    if (!winningBid) {
      this._logger.info(`No bids for auction ${auctionId}. Marking as UNSOLD.`);

      await this._auctionRepository.update(auctionId, {
        status: 'UNSOLD',
        paymentStatus: 'NONE'
      });

      this._socketService.publishAuctionEnded({
        auctionId,
        status: 'UNSOLD',
      });
      return true;
    }

    const platformConfig = await this._platformConfigRepository.getConfig();
    const commissionRate = (platformConfig?.auctionCommissionPercentage ?? 0) / 100;
    const commissionAmount = Math.max(0, winningBid.amount * commissionRate);

    await this._auctionRepository.update(auctionId, { paymentStatus: 'PENDING' });

    const settlementSuccess = await this._walletService.settleAuction(
      winningBid.bidderId,
      auction.hostId,
      winningBid.amount,
      commissionAmount,
      auctionId,
    );

    if (settlementSuccess) {
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

      return true;
    } else {
      this._logger.error(`Settlement FAILED for auction ${auctionId}.`);

      await this._auctionRepository.update(auctionId, {
        status: 'ENDED',
        paymentStatus: 'FAILED',
      });

      return false;
    }
  }
}
