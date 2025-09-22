import { getRabbitChannel } from "../lib/rabbitmq";
import { ArtElasticService } from "../services/artElastic.service";
import { UserElasticService } from "../services/userElastic.service";

const userService = new UserElasticService();
const artService = new ArtElasticService();

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
        console.log(`✅ User indexed in Elasticsearch: ${payload.id}`);
      } else if (eventType === "user.update") {
        await userService.updateUser(payload);
        console.log(`✅ User updated in Elasticsearch: ${payload.id}`);
      } else if (eventType === "art.created") {
        await artService.addArt(payload);
        console.log(`✅ Art indexed in Elasticsearch: ${payload.id}`);
      }
      ch.ack(msg);
    } catch (err) {
      console.error("❌ Failed to index user:", err);
      ch.nack(msg, false, false);
    }
  });

  console.log("📩 Listening to queue: search_indexing");
}
