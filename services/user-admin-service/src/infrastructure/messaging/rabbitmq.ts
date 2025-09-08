import amqp from 'amqplib';
import { config } from '../config/env';
import { logger } from '../../utils/logger';

export async function publishNotification(routingKey: string, message: object) {
  const connection = await amqp.connect(config.rabbitmq_URL);
  const channel = await connection.createChannel();

  const exchange = 'global_exchange';

  await channel.assertExchange(exchange, 'topic', { durable: true });

  channel.publish(
    exchange,
    routingKey, 
    Buffer.from(JSON.stringify(message)),
    { persistent: true }
  );

  logger.info(`📢 Notification sent [${routingKey}] ${JSON.stringify(message)}`);

  setTimeout(() => connection.close(), 500);
}
