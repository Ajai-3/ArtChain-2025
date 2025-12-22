import { Channel, ConsumeMessage } from "amqplib";
import { getRabbitChannel } from "../../rabbitmq";
import { container } from "../../../inversify/inversify.config";
import { TYPES } from "../../../inversify/types";
import { ILikeEventHandler } from "../../../../application/interfaces/handlers/ILikeEventHandler";

export async function startLikeConsumer() {
  const ch: Channel = await getRabbitChannel();
  const queue = "likes";

  await ch.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());
      console.log("📥 Received like event:", event);

      const handler = container.get<ILikeEventHandler>(TYPES.ILikeEventHandler);
      await handler.handle(event);

      ch.ack(msg);
    } catch (err) {
      console.error("❌ Failed processing like event:", err);
      ch.nack(msg, false, false);
    }
  });
}
