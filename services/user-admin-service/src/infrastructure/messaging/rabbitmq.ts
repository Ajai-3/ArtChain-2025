import amqp from 'amqplib';
import { config } from '../config/env';

export async function publishToQueue(queue: string, message: object) {
  try {
    const connection = await amqp.connect(config.rabbitmq_URL);
    const channel = await connection.createChannel();
    
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
    
    console.log(`Message sent to ${queue}`);
    setTimeout(() => connection.close(), 500);
  } catch (error) {
    console.error('RabbitMQ error:', error);
  }
}