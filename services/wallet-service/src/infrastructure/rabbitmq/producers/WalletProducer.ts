import { getRabbitChannel } from "../rabbitmq";
import { logger } from "../../../utils/logger";

export class WalletProducer {
  async publishGiftEvent(data: { 
    senderId: string; 
    receiverId: string; 
    amount: number; 
    message?: string;
    timestamp: Date;
    senderName?: string;
    senderImage?: string; 
  }) {
    try {
      const channel = await getRabbitChannel();
      const exchange = "global_exchange";
      const routingKey = "wallet.gift";

      channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(data)));
      logger.info(`📤 Published gift event: ${routingKey}`);
    } catch (error) {
      logger.error("Failed to publish gift event", error);
    }
  }
}
