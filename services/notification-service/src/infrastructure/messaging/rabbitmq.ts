import amqp, { Connection, Channel } from "amqplib";
import { config } from "../../constants/env";

let connection: Connection;
let channel: Channel;

export async function getRabbitChannel(): Promise<Channel> {
  if (!connection || !channel) {
    let retries = 0;
    const maxRetries = 20;
    const delay = 5000;

    while (retries < maxRetries) {
      try {
        connection = await amqp.connect(config.rabbitmq_url) as any;
        channel = await connection.createChannel();
        console.log("✅ Connected to RabbitMQ");
        break;
      } catch (err) {
        retries++;
        console.error(
          `❌ Failed to connect (attempt ${retries}). Retrying in ${delay / 1000}s...`
        );
        await new Promise((r) => setTimeout(r, delay));
      }
    }

    if (!connection || !channel) {
      throw new Error("Unable to connect to RabbitMQ after multiple retries.");
    }
  }

  return channel;
}
