import { getRabbitChannel } from "../../rabbitmq";

export async function startEmailDLQConsumer() {
  const ch = await getRabbitChannel();
  const dlqName = "emails.dlq";

  await ch.assertQueue(dlqName, { durable: true });

  ch.consume(dlqName, async (msg) => {
    if (!msg) return;
    try {
      const data = JSON.parse(msg.content.toString());
      console.error("☠️ Dead Letter Message:", data);

      ch.ack(msg);
    } catch (err) {
      console.error("❌ Error reading DLQ message:", err);
      ch.ack(msg);
    }
  });

  console.log("☠️ Listening on DLQ: emails.dlq");
}
