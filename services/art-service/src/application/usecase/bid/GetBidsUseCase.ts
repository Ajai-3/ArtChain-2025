import { injectable, inject } from "inversify";
import { IGetBidsUseCase } from "../../interface/usecase/bid/IGetBidsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IBidRepository } from "../../../domain/repositories/IBidRepository";
import { Bid } from "../../../domain/entities/Bid";

@injectable()
export class GetBidsUseCase implements IGetBidsUseCase {
  constructor(
    @inject(TYPES.IBidRepository) private bidRepository: IBidRepository
  ) {}

  async execute(auctionId: string): Promise<Bid[]> {
    return this.bidRepository.findByAuctionId(auctionId);
  }
}
