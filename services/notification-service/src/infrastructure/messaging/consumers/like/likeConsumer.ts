import { Channel, ConsumeMessage } from "amqplib";
import { getRabbitChannel } from "../../rabbitmq";
import { handleLikeEvent } from "../../../../application/notifications/handleLikeEvent";

export async function startLikeConsumer() {
  const ch: Channel = await getRabbitChannel();
  const queue = "likes";

  await ch.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());
      console.log("📥 Received like event:", event);

      await handleLikeEvent(event);

      ch.ack(msg);
    } catch (err) {
      console.error("❌ Failed processing like event:", err);
      ch.nack(msg, false, false);
    }
  });
}
