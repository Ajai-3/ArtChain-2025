import amqp from "amqplib";
import { config } from "../config/env";

export async function publishNotification(routingKey: string, message: object) {
  const connection = await amqp.connect(config.rabbitmq_URL);
  const channel = await connection.createChannel();

  const exchange = "global_exchange";

  await channel.assertExchange(exchange, "direct", { durable: true });

  channel.publish(
    exchange,
    routingKey, 
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );

  console.log(`📢 Notification sent [${routingKey}]`, message);

  setTimeout(() => connection.close(), 500);
}
