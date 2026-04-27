import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { AuctionStatus } from '../../../domain/entities/Auction';
import { IUserService } from '../../interface/service/IUserService';
import { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import { IGetUserBiddingHistoryUseCase } from '../../interface/usecase/auction/IGetUserBiddingHistoryUseCase';
import { BadRequestError } from 'art-chain-shared';
import { AUCTION_MESSAGES } from '../../../constants/AuctionMessages';
import { toBiddingHistoryResponse } from '../../mapper/BiddinghistoryMapper';

@injectable()
export class GetUserBiddingHistoryUseCase implements IGetUserBiddingHistoryUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IAuctionRepository) private readonly _auctionRepo: IAuctionRepository,
  ) { }

  async execute(userId: string, page?: number, limit?: number, status?: AuctionStatus) {
    if (!userId) {
      throw new BadRequestError(AUCTION_MESSAGES.USER_ID_REQUIRED);
    }

    const auctions = await this._auctionRepo.findUserBiddingHistory(userId, page, limit, status);

    const hostIds = auctions.map((a) => a.hostId);
    const winnerIds = auctions.map((a) => a.winnerId).filter((id): id is string => !!id);
    
    const allUserIds = Array.from(new Set([...hostIds, ...winnerIds]));

    const users = await this._userService.getUsersByIds(allUserIds);

    const auctionsWithParticipants = auctions.map((auction) => {
      const host = users.find((u) => u.id === auction.hostId);
      const winner = auction.winnerId ? users.find((u) => u.id === auction.winnerId) : null;

      return toBiddingHistoryResponse(auction, host, winner);
    });

    return auctionsWithParticipants;
  }
}