import amqp, { Connection, Channel } from 'amqplib';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { logger } from '../../utils/logger';

@injectable()
export class RabbitMQService {
  private connection: any = null;
  private channel: any = null;

  private readonly DELAYED_EXCHANGE = 'delayed_exchange';
  private readonly GLOBAL_EXCHANGE = 'global_exchange';
  private readonly DELAYED_QUEUE = 'delayed_queue';
  private readonly ENDED_QUEUE = 'ended_queue';
  public readonly AUCTION_ENDED_KEY = 'auction.ended';

  async connect() {
    if (this.connection) return;
    try {
      this.connection = await amqp.connect(config.rabbitmq_url);
      this.connection.on('error', (err: any) => {
        logger.error('RabbitMQ Connection Error', err);
        this.connection = null;
        this.channel = null;
      });
      this.connection.on('close', () => {
        logger.warn('RabbitMQ Connection Closed');
        this.connection = null;
        this.channel = null;
      });

      this.channel = await this.connection.createChannel();
      await this.setupQueues();
      logger.info('RabbitMQ Connected and Queues Configured');
    } catch (error) {
      logger.error('RabbitMQ Connection Failed', error);
      throw error;
    }
  }

  private async setupQueues() {
    if (!this.channel) return;

    // 1. Global Exchange (DLX Target)
    await this.channel.assertExchange(this.GLOBAL_EXCHANGE, 'topic', { durable: true });

    // 2. Delayed Exchange
    await this.channel.assertExchange(this.DELAYED_EXCHANGE, 'topic', { durable: true });

    // 3. Delayed Queue (TTL -> DLX)
    // Messages sent here with TTL will expire and route to global_exchange with routingKey 'auction.ended'
    await this.channel.assertQueue(this.DELAYED_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': this.GLOBAL_EXCHANGE,
        'x-dead-letter-routing-key': this.AUCTION_ENDED_KEY, 
      }
    });

    // Bind Delayed Queue to Delayed Exchange
    await this.channel.bindQueue(this.DELAYED_QUEUE, this.DELAYED_EXCHANGE, 'auction.delayed');

    // 4. Ended Queue (The destination for expired messages)
    await this.channel.assertQueue(this.ENDED_QUEUE, { durable: true });
    
    // Bind Ended Queue to Global Exchange
    await this.channel.bindQueue(this.ENDED_QUEUE, this.GLOBAL_EXCHANGE, this.AUCTION_ENDED_KEY);
  }

  async publishDelayedAuctionEnd(auctionId: string, durationMs: number) {
    if (!this.channel) await this.connect();

    if (durationMs < 0) durationMs = 0;

    const message = { auctionId };
    
    // Publish to DELAYED_EXCHANGE
    this.channel!.publish(
        this.DELAYED_EXCHANGE, 
        'auction.delayed', 
        Buffer.from(JSON.stringify(message)), 
        { 
            expiration: durationMs.toString(),
            persistent: true 
        }
    );
    logger.info(`Scheduled Auction End for ${auctionId} in ${durationMs}ms`);
  }

  async consume(queue: string, handler: (msg: any) => Promise<void>) {
      if (!this.channel) await this.connect();
      
      logger.info(`Starting consumer for queue: ${queue}`);
      
      this.channel!.consume(queue, async (msg: any) => {
          if (msg) {
              try {
                  const content = JSON.parse(msg.content.toString());
                  await handler(content);
                  this.channel!.ack(msg);
              } catch (error) {
                  logger.error('Error processing message', error);
                  // We might want to NACK if it's a transient error, but for now ACK to avoid loop
                  // Or implement retry logic
                  this.channel!.ack(msg);
              }
          }
      });
  }
  
  getEndedQueueName() {
      return this.ENDED_QUEUE;
  }
}
