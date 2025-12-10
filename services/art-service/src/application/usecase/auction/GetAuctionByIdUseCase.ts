import { injectable, inject } from "inversify";
import { IGetAuctionByIdUseCase } from "../../interface/usecase/auction/IGetAuctionByIdUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

@injectable()
export class GetAuctionByIdUseCase implements IGetAuctionByIdUseCase {
  private repository: IAuctionRepository;

  constructor(
    @inject(TYPES.IAuctionRepository) repository: IAuctionRepository
  ) {
    this.repository = repository;
  }

  async execute(id: string): Promise<Auction | null> {
    return this.repository.getById(id);
  }
}
