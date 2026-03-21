import amqp, { Connection, Channel } from 'amqplib';
import { logger } from '../../utils/logger';
import { config } from '../config/env';

let connection: Connection | null = null;
let channel: Channel | null = null;

export const getRabbitChannel = async (): Promise<Channel> => {
  if (connection && channel) {
    return channel;
  }

  try {
    const conn = await amqp.connect(
      `${config.rabbitmq_URL}?heartbeat=60`,
    );

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

    const ch = await conn.createChannel();
    channel = ch;

    channel.on('error', (err) => {
      logger.error(`[RabbitMQ] Channel Error: ${err.message}`);
      channel = null;
    });

    await ch.assertExchange('global_exchange', 'topic', { durable: true });

    logger.info('✅ RabbitMQ Channel Established');

    return ch;
  } catch (error) {
    logger.error('Failed to connect to RabbitMQ', error);
    return new Promise((resolve) => {
      setTimeout(async () => {
        const retryChan = await getRabbitChannel();
        resolve(retryChan);
      }, 5000);
    });
  }
};
