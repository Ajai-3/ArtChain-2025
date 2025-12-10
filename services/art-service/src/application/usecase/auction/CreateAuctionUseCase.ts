import { injectable, inject } from "inversify";
import { ICreateAuctionUseCase } from "../../interface/usecase/auction/ICreateAuctionUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

@injectable()
export class CreateAuctionUseCase implements ICreateAuctionUseCase {
  private repository: IAuctionRepository;

  constructor(
    @inject(TYPES.IAuctionRepository) repository: IAuctionRepository
  ) {
    this.repository = repository;
  }

  async execute(data: any): Promise<Auction> {
    return this.repository.create(data);
  }
}
