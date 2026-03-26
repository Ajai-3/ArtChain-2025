import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { AUCTION_MESSAGES } from '../../../constants/AuctionMessages';
import { ICancelAuctionUseCase } from '../../interface/usecase/auction/ICancelAuctionUseCase';
import { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import {
  BadRequestError,
  NotFoundError,
  ValidationError,
} from 'art-chain-shared';
import { config } from '../../../infrastructure/config/env';

@injectable()
export class CancelAuctionUseCase implements ICancelAuctionUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository)
    private readonly _auctionRepository: IAuctionRepository,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const auction = await this._auctionRepository.getById(id);

    if (!auction) {
      throw new NotFoundError(AUCTION_MESSAGES.AUCTION_NOT_FOUND);
    }

    if (userId !== auction.hostId && userId !== config.platform_admin_id) {
      throw new BadRequestError(AUCTION_MESSAGES.UNAUTHORIZED_TO_CANCEL_AUCTION);
    }

    if (auction.status === 'ACTIVE') {
      throw new BadRequestError(AUCTION_MESSAGES.CANNOT_CANCEL_ACTIVE_AUCTION);
    } else if (auction.status === 'ENDED' || auction.status === 'CANCELLED') {
      throw new ValidationError(
        AUCTION_MESSAGES.CANNOT_CANCEL_ENDED_OR_CANCELLED_AUCTION,
      );
    }

    await this._auctionRepository.updateStatus(id, 'CANCELLED');
  }
}
