import { injectable, inject } from "inversify";
import { IGetBidsUseCase } from "../../interface/usecase/bid/IGetBidsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { UserService } from "../../../infrastructure/service/UserService";
import { BidMapper } from "../../mapper/BidMapper";
import { BidResponseDTO } from "../../interface/dto/bid/BidResponseDTO";

@injectable()
export class GetBidsUseCase implements IGetBidsUseCase {
  constructor(
    @inject(TYPES.IBidRepository) private bidRepository: IBidRepository
  ) {}

  async execute(auctionId: string): Promise<BidResponseDTO[]> {
    const bids = await this.bidRepository.findByAuctionId(auctionId);
    
    const userIds = [...new Set(bids.map(b => b.bidderId))];
    const users = await UserService.getUsersByIds(userIds);
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    return bids.map(bid => {
      const bidder = userMap.get(bid.bidderId);
      return BidMapper.toDTO(bid, bidder);
    });
  }
}
