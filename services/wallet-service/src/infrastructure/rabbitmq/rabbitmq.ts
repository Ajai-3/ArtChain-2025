import amqp, { Channel } from "amqplib";
import { logger } from "../../utils/logger";

let connection: Awaited<ReturnType<typeof amqp.connect>> | null = null;
let channel: Channel | null = null;

export const getRabbitChannel = async (): Promise<Channel> => {
  if (channel) return channel;

  try {
    const conn = await amqp.connect(process.env.RABBITMQ_URL!);
    connection = conn;

    conn.on("error", (err) => {
      logger.error("RabbitMQ Connection Error", err);
      connection = null;
      channel = null;
    });

    conn.on("close", () => {
      logger.warn("RabbitMQ Connection Closed");
      connection = null;
      channel = null;
    });

    const ch = await conn.createChannel();
    channel = ch;

    await ch.assertExchange("global_exchange", "topic", { durable: true });
    
    logger.info("✅ RabbitMQ Channel Established");
    
    return ch;
  } catch (error) {
    logger.error("Failed to connect to RabbitMQ", error);
    connection = null;
    channel = null;
    throw error;
  }
};
