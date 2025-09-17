import { getRabbitChannel } from "../lib/rabbitmq";
import { UserElasticService } from "../services/userElastic.service";

const userService = new UserElasticService();

export async function startUserConsumer() {
  const ch = await getRabbitChannel();

  await ch.assertQueue("search_indexing", { durable: true });

  ch.consume("search_indexing", async (msg) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      const eventType = msg.fields.routingKey;

      if (eventType === "user.created") {
        await userService.addUser(payload);
      } else if (eventType === "user.update") {
        await userService.updateUser(payload);
      }
      ch.ack(msg);
      console.log(`✅ User indexed in Elasticsearch: ${payload.id}`);
    } catch (err) {
      console.error("❌ Failed to index user:", err);
      ch.nack(msg, false, false);
    }
  });

  console.log("📩 Listening to queue: search_indexing");
}
