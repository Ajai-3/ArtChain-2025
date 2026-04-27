import { injectable, inject } from 'inversify';
import { IGetAuctionsUseCase } from '../../interface/usecase/auction/IGetAuctionsUseCase';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { IAuctionRepository } from '../../../domain/repositories/IAuctionRepository';
import { IBidRepository } from '../../../domain/repositories/IBidRepository';
import { IS3Service } from '../../../domain/interfaces/IS3Service';
import { AuctionMapper } from '../../mapper/AuctionMapper';
import { GetAuctionsDTO } from '../../interface/dto/auction/GetAuctionsDTO';
import { IUserService } from '../../interface/service/IUserService';
import type { UserPublicProfile } from '../../../types/user';

@injectable()
export class GetAuctionsUseCase implements IGetAuctionsUseCase {
  constructor(
    @inject(TYPES.IUserService) private _userService: IUserService,
    @inject(TYPES.IAuctionRepository) private _auctionRepo: IAuctionRepository,
    @inject(TYPES.IBidRepository) private _bidRepository: IBidRepository,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
  ) { }

  async execute(
    dto: GetAuctionsDTO,
  ): Promise<{ auctions: ReturnType<typeof AuctionMapper.toDTO>[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      filterStatus,
      startDate,
      endDate,
      hostId,
    } = dto;

    const { auctions, total } = await this._auctionRepo.findActiveAuctions(
      page,
      limit,
      filterStatus,
      startDate,
      endDate,
      hostId,
    );

    if (!auctions.length) return { auctions: [], total: 0 };

    const now = new Date();
    const allUserIds = new Set<string>();

    const auctionsData = await Promise.all(
      auctions.map(async (auction) => {
        const { bids } = await this._bidRepository.findByAuctionId(auction._id!);
        
        const signedImageUrl = await this._s3Service.getSignedUrl(
          auction.imageKey,
          'bidding',
        );

        let currentStatus = auction.status;

        if (currentStatus === 'SCHEDULED' && new Date(auction.startTime) <= now) {
          currentStatus = 'ACTIVE';
          this._auctionRepo.update(auction._id!, { status: 'ACTIVE' }).catch(() => {});
        } 
        else if (currentStatus === 'ACTIVE' && new Date(auction.endTime) <= now) {
          currentStatus = bids.length > 0 ? 'ENDED' : 'UNSOLD';
        }

        const updatedAuction = { ...auction, status: currentStatus };

        allUserIds.add(auction.hostId);
        if (auction.winnerId) allUserIds.add(auction.winnerId);
        bids.forEach((bid) => allUserIds.add(bid.bidderId));

        return { auction: updatedAuction, bids, signedImageUrl };
      }),
    );

    const users = await this._userService.getUsersByIds([...allUserIds]);
    const userMap = new Map<string, UserPublicProfile>(users.map((u) => [u.id, u]));

    const mappedAuctions = auctionsData.map(
      ({ auction, bids, signedImageUrl }) => {
        const host = userMap.get(auction.hostId) ?? null;
        return AuctionMapper.toDTO(
          auction,
          signedImageUrl,
          host,
          bids,
          userMap,
        );
      },
    );

    return { auctions: mappedAuctions, total };
  }
}