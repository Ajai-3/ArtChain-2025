import { injectable, inject } from 'inversify';
import { RabbitMQService } from '../RabbitMQService';
import { TYPES } from '../../Inversify/types';
import { IEndAuctionUseCase } from '../../../application/interface/usecase/auction/IEndAuctionUseCase';
import { logger } from '../../../utils/logger';
import type { AuctionEndedMessage } from '../../../types/rabbitmq';
import type { JsonObject } from '../../../types/json';

@injectable()
export class AuctionEndedConsumer {
  constructor(
    @inject(TYPES.RabbitMQService) private rabbitMQService: RabbitMQService,
    @inject(TYPES.IEndAuctionUseCase)
    private endAuctionUseCase: IEndAuctionUseCase,
  ) {}

  async start() {
    const queue = this.rabbitMQService.getEndedQueueName();
    await this.rabbitMQService.consume(queue, async (msg) => {
      const payload = msg as JsonObject;
      const auctionId = payload.auctionId;
      logger.info(`Processing Auction End Event: ${auctionId}`);

      if (typeof auctionId === 'string' && auctionId.length > 0) {
        const typed: AuctionEndedMessage = { auctionId };
        return await this.endAuctionUseCase.execute(typed.auctionId);
      }
      return true; 
    });
  }
}
