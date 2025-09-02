import { Channel, ConsumeMessage } from "amqplib";
import { getRabbitChannel } from "../../rabbitmq";
import { handleSupportEvent } from "../../../../application/notifications/handleSupportEvent";

export async function startSupportConsumer() {
  const ch: Channel = await getRabbitChannel();
  const queue = "supports";

  await ch.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const event = JSON.parse(msg.content.toString());
      console.log("📥 Received support event:", event);

      await handleSupportEvent(event);

      ch.ack(msg);
    } catch (err) {
      console.error("❌ Failed processing support event:", err);
      ch.nack(msg, false, false);
    }
  });
}
