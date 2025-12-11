import { injectable, inject } from "inversify";
import { IGetAuctionsUseCase } from "../../interface/usecase/auction/IGetAuctionsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { UserService } from "../../../infrastructure/service/UserService";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { IS3Service } from "../../../domain/interfaces/IS3Service";
import { AuctionMapper } from "../../mapper/AuctionMapper";
import { GetAuctionsDTO } from "../../interface/dto/auction/GetAuctionsDTO";

@injectable()
export class GetAuctionsUseCase implements IGetAuctionsUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository) private _repository: IAuctionRepository,
    @inject(TYPES.IBidRepository) private _bidRepository: IBidRepository,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service
  ) {}

  async execute(dto: GetAuctionsDTO): Promise<{ auctions: any[]; total: number }> {
    const { 
        page = 1, 
        limit = 10, 
        filterStatus, 
        startDate, 
        endDate, 
        hostId 
    } = dto;
    
    // Destructure result from repository
    const { auctions, total } = await this._repository.findActiveAuctions(page, limit, filterStatus, startDate, endDate, hostId);

    if (!auctions.length) return { auctions: [], total: 0 };
    
    const now = new Date();
    const updatedAuctions = await Promise.all(auctions.map(async (auction) => {
        if (auction.status === 'SCHEDULED' && new Date(auction.startTime) <= now) {
            await this._repository.updateStatus(auction._id!, 'ACTIVE');
            return { ...auction, status: 'ACTIVE' }; 
        }
        if (auction.status === 'ACTIVE' && new Date(auction.endTime) <= now) {
            await this._repository.updateStatus(auction._id!, 'ENDED');
            return { ...auction, status: 'ENDED' };
        }
        return auction;
    }));

    const finalAuctions = updatedAuctions as any[];

    const hostIds = finalAuctions.map((a) => a.hostId);
    let allUserIds = new Set<string>(hostIds);
    finalAuctions.forEach(a => {
        if(a.winnerId) allUserIds.add(a.winnerId);
    });

    const auctionsData = await Promise.all(
      finalAuctions.map(async (auction) => {
        const bids = await this._bidRepository.findByAuctionId(auction._id!);
        const signedImageUrl = await this._s3Service.getSignedUrl(auction.imageKey, 'bidding');

        bids.forEach(bid => allUserIds.add(bid.bidderId));

        return { auction, bids, signedImageUrl };
      })
    );

    const users = await UserService.getUsersByIds([...allUserIds]);
    console.log(users)
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const mappedAuctions = auctionsData.map(({ auction, bids, signedImageUrl }) => {
      const host = userMap.get(auction.hostId);
      return AuctionMapper.toDTO(auction, signedImageUrl, host, bids, userMap);
    });

    return { auctions: mappedAuctions, total };
  }
}
