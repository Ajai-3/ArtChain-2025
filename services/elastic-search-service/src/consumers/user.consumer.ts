import { getRabbitChannel } from "../lib/rabbitmq";
import { UserElasticService } from "../services/userElastic.service";

const userService = new UserElasticService();

export async function startUserConsumer() {
  const ch = await getRabbitChannel();

  await ch.assertQueue("search_indexing", { durable: true });

  ch.consume("search_indexing", async (msg) => {
    if (!msg) return;

    try {
      const user = JSON.parse(msg.content.toString());
      await userService.addUser(user);
      ch.ack(msg);
      console.log(`✅ User indexed in Elasticsearch: ${user.id}`);
    } catch (err) {
      console.error("❌ Failed to index user:", err);
      ch.nack(msg, false, false); 
    }
  });

  console.log("📩 Listening to queue: search_indexing");
}
