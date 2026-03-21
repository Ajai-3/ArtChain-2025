import amqp, { Connection, Channel } from 'amqplib';
import { config } from '../config/env';

let connection: Connection | null = null;
let channel: Channel | null = null;

export async function getRabbitChannel(): Promise<Channel> {
  if (connection && channel) {
    return channel;
  }

  try {
    const conn = await amqp.connect(`${config.rabbitmq_url}?heartbeat=60`);

    connection = conn as unknown as Connection;

    connection.on('error', (err) => {
      console.error(`[RabbitMQ] Connection Error: ${err.message}`);
      connection = null;
      channel = null;
    });

    connection.on('close', () => {
      console.warn('[RabbitMQ] Connection Closed. Reconnecting...');
      connection = null;
      channel = null;
      setTimeout(getRabbitChannel, 5000);
    });

    const chan = await conn.createChannel();
    channel = chan;

    channel.on('error', (err) => {
      console.error(`[RabbitMQ] Channel Error: ${err.message}`);
      channel = null;
    });

    return chan;
  } catch (err) {
    console.error('❌ Failed to connect to RabbitMQ. Retrying in 5s...');
    return new Promise((resolve) => {
      setTimeout(async () => {
        const retryChan = await getRabbitChannel();
        resolve(retryChan);
      }, 5000);
    });
  }
}
