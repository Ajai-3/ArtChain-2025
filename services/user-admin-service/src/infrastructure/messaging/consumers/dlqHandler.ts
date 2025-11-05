import amqp from "amqplib";
import { config } from "../../config/env";
import type { Channel, Connection } from "amqplib";

const DLQ_MAPPING = {
  "profile_update.dlq": "profile_update",
};

export async function initDLQHandler(): Promise<void> {
  let conn: Connection;
  let ch: Channel;

  try {
    const conn: Connection = await amqp.connect(config.rabbitmq_URL) as any;
    const ch: Channel = await conn.createChannel();

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
  // Ensure DLQ exists
  await ch.assertQueue(dlq, { durable: true });

  console.log(`👂 Monitoring DLQ: ${dlq}`);

  ch.consume(
    dlq,
    async (msg) => {
      if (!msg) return;

      try {
        const messageContent = msg.content.toString();
        console.error(`🚨 DLQ Message received from ${dlq}:`, {
          queue: originalQueue,
          message: messageContent,
          timestamp: new Date().toISOString(),
        });

        // Here you can:
        // 1. Send to monitoring service
        // 2. Notify administrators
        // 3. Log to file
        // 4. Attempt reprocessing if needed

        // For now, we'll just ack and log
        ch.ack(msg);
        console.log(`📝 DLQ message acknowledged from ${dlq}`);
      } catch (error) {
        console.error(`❌ Error processing DLQ message from ${dlq}:`, error);
        // Even if logging fails, we ack to prevent blocking
        ch.ack(msg);
      }
    },
    { noAck: false }
  );
}
