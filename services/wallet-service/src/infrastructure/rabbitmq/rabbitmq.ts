import amqp, { Channel, Connection } from "amqplib";
import { logger } from "../../utils/logger";

let connection: Connection | null = null;
let channel: Channel | null = null;

export const getRabbitChannel = async (): Promise<Channel> => {
  if (channel) return channel;

  try {
    connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    await channel.assertExchange("global_exchange", "topic", { durable: true });
    
    logger.info("✅ RabbitMQ Channel Established");
    
    connection.on("error", (err) => {
      logger.error("RabbitMQ Connection Error", err);
      connection = null;
      channel = null;
    });

    connection.on("close", () => {
      logger.warn("RabbitMQ Connection Closed");
      connection = null;
      channel = null;
    });

    return channel;
  } catch (error) {
    logger.error("Failed to connect to RabbitMQ", error);
    throw error;
  }
};
