import { injectable, inject } from "inversify";
import { IGetBidsUseCase } from "../../interface/usecase/bid/IGetBidsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { UserService } from "../../../infrastructure/service/UserService";
import { BidMapper } from "../../mapper/BidMapper";
import { BidResponseDTO } from "../../interface/dto/bid/BidResponseDTO";
import { IUserService } from "../../interface/service/IUserService";

@injectable()
export class GetBidsUseCase implements IGetBidsUseCase {
  constructor(
      @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IBidRepository) private readonly bidRepository: IBidRepository
  ) {}

  async execute(
    auctionId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ bids: BidResponseDTO[]; total: number }> {
    const { bids, total } = await this.bidRepository.findByAuctionId(
      auctionId,
      page,
      limit
    );

    if (bids.length === 0) {
      return { bids: [], total };
    }

    const userIds = [...new Set(bids.map((b) => b.bidderId))];
    const users = await this._userService.getUsersByIds(userIds);
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const mappedBids = bids.map((bid) => {
      const bidder = userMap.get(bid.bidderId);
      return BidMapper.toDTO(bid, bidder);
    });

    return { bids: mappedBids, total };
  }
}
