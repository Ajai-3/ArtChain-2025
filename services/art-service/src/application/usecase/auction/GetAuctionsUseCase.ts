import { injectable, inject } from "inversify";
import { IGetAuctionsUseCase } from "../../interface/usecase/auction/IGetAuctionsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { UserService } from "../../../infrastructure/service/UserService";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { IS3Service } from "../../../domain/interfaces/IS3Service";
import { AuctionMapper } from "../../mapper/AuctionMapper";

@injectable()
export class GetAuctionsUseCase implements IGetAuctionsUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository) private _repository: IAuctionRepository,
    @inject(TYPES.IBidRepository) private _bidRepository: IBidRepository,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service
  ) {}

  async execute(
    page: number = 1, 
    limit: number = 10,
    filterStatus?: string,
    startDate?: Date,
    endDate?: Date
    ): Promise<any[]> {
    
    // Fetch auctions with filters
    const auctions = await this._repository.findActiveAuctions(page, limit, filterStatus, startDate, endDate);

    if (!auctions.length) return [];
    
    // Check for status updates (Lazy update)
    const now = new Date();
    const updatedAuctions = await Promise.all(auctions.map(async (auction) => {
        if (auction.status === 'SCHEDULED' && new Date(auction.startTime) <= now) {
            await this._repository.updateStatus(auction._id!, 'ACTIVE');
            return { ...auction, status: 'ACTIVE' }; 
        }
        return auction;
    }));

    const finalAuctions = updatedAuctions as any[];

    // Collect all unique user IDs (hosts)
    const hostIds = finalAuctions.map((a) => a.hostId);
    let allUserIds = new Set<string>(hostIds);

    // Prepare data for mapping
    const auctionsData = await Promise.all(
      finalAuctions.map(async (auction) => {
        const bids = await this._bidRepository.findByAuctionId(auction._id!);
        const signedImageUrl = await this._s3Service.getSignedUrl(auction.imageKey, 'bidding');

        bids.forEach(bid => allUserIds.add(bid.bidderId));

        return { auction, bids, signedImageUrl };
      })
    );

    // Fetch all users
    const users = await UserService.getUsersByIds([...allUserIds]);
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    // Use Mapper
    return auctionsData.map(({ auction, bids, signedImageUrl }) => {
      const host = userMap.get(auction.hostId);
      return AuctionMapper.toDTO(auction, signedImageUrl, host, bids, userMap);
    });
  }
}
