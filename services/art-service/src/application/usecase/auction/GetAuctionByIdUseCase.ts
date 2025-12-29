import { injectable, inject } from "inversify";
import { IGetAuctionByIdUseCase } from "../../interface/usecase/auction/IGetAuctionByIdUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { IS3Service } from "../../../domain/interfaces/IS3Service";
import { UserService } from "../../../infrastructure/service/UserService";
import { AuctionMapper } from "../../mapper/AuctionMapper";
import { NotFoundError } from "art-chain-shared";
import { AUCTION_MESSAGES } from "../../../constants/AuctionMessages";
import { GetAuctionByIdDTO } from "../../interface/dto/auction/GetAuctionByIdDTO";
import { IUserService } from "../../interface/service/IUserService";

@injectable()
export class GetAuctionByIdUseCase implements IGetAuctionByIdUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository) private _repository: IAuctionRepository,
    @inject(TYPES.IBidRepository) private _bidRepository: IBidRepository,
    @inject(TYPES.IS3Service) private _s3Service: IS3Service,
    @inject(TYPES.IUserService) private _userService: IUserService
  ) {}

  async execute(dto: GetAuctionByIdDTO): Promise<any | null> {
    const { id } = dto;
    const auction = await this._repository.getById(id);
    if (!auction) {
        throw new NotFoundError(AUCTION_MESSAGES.AUCTION_NOT_FOUND);
    };

    const [{ bids }, signedImageUrl] = await Promise.all([
      this._bidRepository.findByAuctionId(auction._id!),
      this._s3Service.getSignedUrl(auction.imageKey, 'bidding') 
    ]);

    const userIds = new Set<string>();
    userIds.add(auction.hostId);
    if (auction.winnerId) userIds.add(auction.winnerId);
    bids.forEach(bid => userIds.add(bid.bidderId));

    const users = await this._userService.getUsersByIds([...userIds]);
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const host = userMap.get(auction.hostId);
    
    return AuctionMapper.toDTO(auction, signedImageUrl, host, bids, userMap);
  }
}
