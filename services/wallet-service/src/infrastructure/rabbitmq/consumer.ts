import amqp from "amqplib";
import { logger } from "../../utils/logger";
import { startAllConsumers } from "./consumers/index";

export async function startConsumers() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    const ch = await connection.createChannel();
    await ch.assertExchange("global_exchange", "topic", { durable: true });

    logger.info("✅ RabbitMQ connection established and exchange asserted");

    await startAllConsumers(ch);

    logger.info("🚀 All consumers started successfully");
  } catch (error) {
    logger.error("❌ Failed to start RabbitMQ consumers:", error);
    process.exit(1);
  }
}
