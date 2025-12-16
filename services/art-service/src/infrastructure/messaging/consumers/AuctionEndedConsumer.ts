import { injectable, inject } from "inversify";
import { RabbitMQService } from "../RabbitMQService";
import { TYPES } from "../../Inversify/types";
import { IEndAuctionUseCase } from "../../../application/interface/usecase/auction/IEndAuctionUseCase";
import { logger } from "../../../utils/logger";

@injectable()
export class AuctionEndedConsumer {
  constructor(
     @inject(TYPES.RabbitMQService) private rabbitMQService: RabbitMQService,
     @inject(TYPES.IEndAuctionUseCase) private endAuctionUseCase: IEndAuctionUseCase
  ) {}

  async start() {
      const queue = this.rabbitMQService.getEndedQueueName();
      await this.rabbitMQService.consume(queue, async (msg: any) => {
          logger.info(`Auction Ended Event Received: ${JSON.stringify(msg)}`);
          if (msg && msg.auctionId) {
              await this.endAuctionUseCase.execute(msg.auctionId);
          }
      });
  }
}
