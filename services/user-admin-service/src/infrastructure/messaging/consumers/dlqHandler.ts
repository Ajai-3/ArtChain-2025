import amqp from "amqplib";
import { config } from "../../config/env";
import type { Channel, Connection } from "amqplib";

const DLQ_MAPPING = {
  "profile_update.dlq": "profile_update",
};

const MAX_RETRIES = 3;

export async function initDLQHandler(): Promise<void> {
  let conn: Connection;
  let ch: Channel;

  try {
    conn = await amqp.connect(config.rabbitmq_URL) as any;
    ch = await conn.createChannel();

    for (const [dlq, originalQueue] of Object.entries(DLQ_MAPPING)) {
      await processDLQ(ch, dlq, originalQueue);
    }

    console.log("✅ DLQ Handler initialized");
  } catch (error) {
    console.error("❌ Failed to initialize DLQ handler:", error);
    setTimeout(initDLQHandler, 5000);
  }
}

async function processDLQ(
  ch: Channel,
  dlq: string,
  originalQueue: string
): Promise<void> {
  await ch.assertQueue(dlq, { durable: true });

  ch.consume(
    dlq,
    async (msg) => {
      if (!msg) return;

      try {
        const messageContent = JSON.parse(msg.content.toString());
        const retryCount = messageContent.retryCount || 0;

        if (retryCount < MAX_RETRIES) {
          const newMessage = { ...messageContent, retryCount: retryCount + 1 };
          ch.sendToQueue(originalQueue, Buffer.from(JSON.stringify(newMessage)));
          console.log(`🔄 Retrying message to ${originalQueue}: retry ${retryCount + 1}`);
        } else {
          console.error("❌ Max retries reached, leaving message in DLQ:", messageContent);
        }

        ch.ack(msg);
      } catch (error) {
        console.error("❌ Error processing DLQ message:", error);
        ch.ack(msg);
      }
    },
    { noAck: false }
  );
}
