import { Channel } from "amqplib";
import { logger } from "../../utils/logger";
import { startAllConsumers } from "./consumers/index";
import { getRabbitChannel } from "../rabbitmq";

export async function startConsumers() {
  try {
    const ch: Channel = await getRabbitChannel();
    
    await startAllConsumers(ch);

    logger.info("🚀 All consumers started successfully");
  } catch (error) {
    logger.error("❌ Failed to start RabbitMQ consumers:", error);
    process.exit(1);
  }
}
