import { Channel } from "amqplib";

export async function setupNotificationQueues(ch: Channel) {
  const exchange = "global_exchange";

  await ch.assertExchange(exchange, "topic", { durable: true });

  // Email queue + DLQ
  await ch.assertQueue("emails", {
    durable: true,
    deadLetterExchange: "",
    deadLetterRoutingKey: "emails.dlq",
  });
  await ch.bindQueue("emails", exchange, "email.*");

  // Elasticsearch indexing queue
  await ch.assertQueue("search_indexing", { durable: true });
  await ch.bindQueue("search_indexing", exchange, "user.created");
  await ch.bindQueue("search_indexing", exchange, "user.update");
  await ch.bindQueue("search_indexing", exchange, "art.created");
  await ch.bindQueue("search_indexing", exchange, "art.update");

  // Supporters queue
  await ch.assertQueue("supports", { durable: true });
  await ch.bindQueue("supports", exchange, "user.supported");


  // Like queue
  await ch.assertQueue("likes", { durable: true });
  await ch.bindQueue("likes", exchange, "like");

  console.log("✅ Notification queues + DLQ setup complete");
}
