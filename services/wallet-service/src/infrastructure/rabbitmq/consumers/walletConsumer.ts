import { Channel } from "amqplib";
import { logger } from "../../../utils/logger";
import { WalletRepositoryImpl } from "../../repositories/WalletRepositoryImpl";

const walletRepo = new WalletRepositoryImpl();

export async function walletConsumer(ch: Channel) {
  const queue = "wallet-service";

  await ch.assertQueue(queue, { durable: true });
  await ch.bindQueue(queue, "global_exchange", "user.created");

  logger.info(`✅ WalletConsumer listening on queue "${queue}" for event "user.created"`);

  ch.consume(queue, async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      logger.info(`[WalletConsumer] Received user.created event: ${JSON.stringify(payload)}`);

      const existingWallet = await walletRepo.getByUserId(payload.id);
      if (!existingWallet) {
        await walletRepo.create({ userId: payload.id, balance: 0 });
        logger.info(`[WalletConsumer] Wallet created for user ${payload.id}`);
      } else {
        logger.info(`[WalletConsumer] Wallet already exists for user ${payload.id}`);
      }

      ch.ack(msg);
      logger.info(`[WalletConsumer] Message acknowledged for user ${payload.id}`);
    } catch (error) {
      logger.error(`[WalletConsumer] Error processing message: ${error}`);
      ch.nack(msg, false, false); 
    }
  });
}
