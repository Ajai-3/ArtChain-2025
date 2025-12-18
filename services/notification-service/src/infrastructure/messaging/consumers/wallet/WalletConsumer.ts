import { Channel, ConsumeMessage } from "amqplib";
import { getRabbitChannel } from "../../rabbitmq";
import { container } from "../../../inversify/inversify.config";
import { TYPES } from "../../../inversify/types";
import { IGiftEventHandler } from "../../../../application/interfaces/handlers/IGiftEventHandler";
import { logger } from "../../../utils/logger";

export async function startWalletConsumer() {
  const ch: Channel = await getRabbitChannel();
  const queue = "wallet_notifications";

  logger.info(`✅ Wallet Consumer listening on ${queue}`);

  await ch.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const routingKey = msg.fields.routingKey;
      const event = JSON.parse(msg.content.toString());
      logger.info(`📥 Received Wallet Event [${routingKey}]: ${JSON.stringify(event)}`);

      if (routingKey === "wallet.gift") {
        const handler = container.get<IGiftEventHandler>(TYPES.IGiftEventHandler);
        await handler.handle(event);
      }
      // Future additional wallet event handlers can be added here
      
      ch.ack(msg);
    } catch (err) {
      logger.error("❌ Failed processing wallet event:", err);
      ch.nack(msg, false, false);
    }
  });
}
