import { Channel } from "amqplib";

export async function setupNotificationQueues(ch: Channel) {
  const exchange = "global_exchange";

  await ch.assertExchange(exchange, "direct", { durable: true });

  // Email queue + DLQ
  await ch.assertQueue("emails", {
    durable: true,
    deadLetterExchange: "",
    deadLetterRoutingKey: "emails.dlq",
  });
  await ch.assertQueue("emails.dlq", { durable: true });
  await ch.bindQueue("emails", exchange, "email");

  // Follow queue
  await ch.assertQueue("supports", { durable: true });
  await ch.bindQueue("supports", exchange, "support");

  // Like queue
  await ch.assertQueue("likes", { durable: true });
  await ch.bindQueue("likes", exchange, "like");

  console.log("✅ Notification queues + DLQ setup complete");
}
