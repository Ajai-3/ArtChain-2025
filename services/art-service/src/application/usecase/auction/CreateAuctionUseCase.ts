import { injectable, inject } from "inversify";
import { ICreateAuctionUseCase } from "../../interface/usecase/auction/ICreateAuctionUseCase";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { IAuctionRepository } from "../../../domain/repositories/IAuctionRepository";
import { Auction } from "../../../domain/entities/Auction";

import { CreateAuctionDTO } from "../../interface/dto/auction/CreateAuctionDTO";
import { RabbitMQService } from "../../../infrastructure/messaging/RabbitMQService";

@injectable()
export class CreateAuctionUseCase implements ICreateAuctionUseCase {
  constructor(
    @inject(TYPES.IAuctionRepository) private repository: IAuctionRepository,
    @inject(TYPES.RabbitMQService) private rabbitMQService: RabbitMQService
  ) {}

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
    
    const savedAuction = await this.repository.create(auction);

    if (savedAuction._id) {
        const now = new Date();
        const endTime = new Date(savedAuction.endTime);
        const delay = endTime.getTime() - now.getTime();
        
        // Only schedule if future (or near future)
        if (delay > 0) {
            await this.rabbitMQService.publishDelayedAuctionEnd(savedAuction._id, delay);
        }
    }

    return savedAuction;
  }
}
