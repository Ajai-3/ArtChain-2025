import { injectable, inject } from "inversify";
import { ICreateAuctionUseCase } from "../../interface/usecase/auction/ICreateAuctionUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

import { CreateAuctionDTO } from "../../interface/dto/auction/CreateAuctionDTO";

@injectable()
export class CreateAuctionUseCase implements ICreateAuctionUseCase {
  private repository: IAuctionRepository;

  constructor(
    @inject(TYPES.IAuctionRepository) repository: IAuctionRepository
  ) {
    this.repository = repository;
  }

  async execute(data: CreateAuctionDTO): Promise<Auction> {
    const auction = new Auction(
      data.hostId,
      data.title,
      data.description,
      data.imageKey,
      data.startPrice,
      data.startTime,
      data.endTime
    );
    return this.repository.create(auction);
  }
}
