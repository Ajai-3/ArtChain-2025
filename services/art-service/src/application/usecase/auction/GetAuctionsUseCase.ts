import { injectable, inject } from "inversify";
import { IGetAuctionsUseCase } from "../../interface/usecase/auction/IGetAuctionsUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

@injectable()
export class GetAuctionsUseCase implements IGetAuctionsUseCase {
  private repository: IAuctionRepository;

  constructor(
    @inject(TYPES.IAuctionRepository) repository: IAuctionRepository
  ) {
    this.repository = repository;
  }

  async execute(page = 1, limit = 10): Promise<Auction[]> {
    return this.repository.findActiveAuctions(page, limit);
  }
}
