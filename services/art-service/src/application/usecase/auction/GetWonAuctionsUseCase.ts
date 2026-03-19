import { inject, injectable } from "inversify";
import { Auction } from "../../../domain/entities/Auction";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IUserService } from "../../interface/service/IUserService";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { IGetWonAuctionsUseCase } from "../../interface/usecase/auction/IGetWonAuctionsUseCase";

@injectable()
export class GetWonAuctionsUseCase implements IGetWonAuctionsUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: IUserService,
    @inject(TYPES.IAuctionRepository) private readonly _auctionRepo: IAuctionRepository,
  ) {}

  async execute(userId: string, page?: number, limit?: number): Promise<Auction[]> {
    const auctions = await this._auctionRepo.findWonAuctions(userId, page, limit);

    const hostIds = Array.from(new Set(auctions.map((auction) => auction.hostId)));

    const hosts = await this._userService.getUsersByIds(hostIds);

    const auctionsWithHosts = auctions.map((auction) => {

      const host = hosts.find((h) => h.id === auction.hostId);

      return {
        ...auction,
        host: {
            id: host.id,
            name: host.name,
            username: host.username,
            profileImage: host.profileImage,
            backgroundImage: host.backgroundImage,
        } 
      };
    });

    return auctionsWithHosts;
  }
}