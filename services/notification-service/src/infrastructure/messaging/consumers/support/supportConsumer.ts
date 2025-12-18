import { Channel, ConsumeMessage } from "amqplib";
import { getRabbitChannel } from "../../rabbitmq";
import { container } from "../../../inversify/inversify.config";
import { TYPES } from "../../../inversify/types";
import { ISupportEventHandler } from "../../../../application/interfaces/handlers/ISupportEventHandler";

export async function startSupportConsumer() {
  const ch: Channel = await getRabbitChannel();
  const queue = "supports";

  await ch.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());
      console.log("📥 Received support event:", event);

      const handler = container.get<ISupportEventHandler>(TYPES.ISupportEventHandler);
      await handler.handle(event);

      ch.ack(msg);
    } catch (err) {
      console.error("❌ Failed processing support event:", err);
      ch.nack(msg, false, false);
    }
  });
}
