import amqp, { Connection, Channel } from 'amqplib';
import { config } from '../config/env';
import { logger } from '../../utils/logger';

let connection: Connection | null = null;
let channel: Channel | null = null;

async function getRabbitChannel(): Promise<Channel> {
  if (connection && channel) {
    return channel;
  }

  try {
    logger.info('Connecting to RabbitMQ...');

    const conn = await amqp.connect(`${config.rabbitmq_URL}?heartbeat=60`);

    connection = conn as unknown as Connection;

    connection.on('error', (err) => {
      logger.error(`[RabbitMQ] Connection Error: ${err.message}`);
      connection = null;
      channel = null;
    });

    connection.on('close', () => {
      logger.warn('[RabbitMQ] Connection Closed. Reconnecting...');
      connection = null;
      channel = null;
      setTimeout(getRabbitChannel, 5000);
    });

    const chan = await conn.createChannel();
    channel = chan;

    channel.on('error', (err) => {
      logger.error(`[RabbitMQ] Channel Error: ${err.message}`);
      channel = null;
    });

    const exchange = 'global_exchange';
    await chan.assertExchange(exchange, 'topic', { durable: true });

    return chan;
  } catch (error) {
    logger.error(`[RabbitMQ] Setup Failed: ${error}`);
    return new Promise((resolve) => {
      setTimeout(async () => {
        const retryChan = await getRabbitChannel();
        resolve(retryChan);
      }, 5000);
    });
  }
}

export async function publishNotification(routingKey: string, message: object) {
  try {
    const activeChannel = await getRabbitChannel();

    activeChannel!.publish(
      'global_exchange',
      routingKey,
      Buffer.from(JSON.stringify(message)),
      { persistent: true },
    );

    logger.info(`📢 Notification sent [${routingKey}]`);
  } catch (error) {
    logger.error(`❌ Failed to publish notification: ${error}`);
  }
}
