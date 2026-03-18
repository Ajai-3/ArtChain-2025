import amqp from 'amqplib';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { logger } from '../../utils/logger';

@injectable()
export class RabbitMQService {
  private connection: any = null;
  private channel: any = null;

  private readonly DELAYED_EXCHANGE = 'delayed_exchange';
  private readonly GLOBAL_EXCHANGE = 'global_exchange';
  private readonly RETRY_EXCHANGE = 'auction_retry_exchange';

  private readonly DELAYED_QUEUE = 'delayed_queue';
  private readonly ENDED_QUEUE = 'ended_queue';
  private readonly RETRY_QUEUE = 'auction_retry_queue';

  public readonly AUCTION_ENDED_KEY = 'auction.ended';

  async connect() {
    if (this.connection) return;
    try {
      this.connection = await amqp.connect(config.rabbitmq_url);
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

    // 1. Exchanges
    await this.channel.assertExchange(this.GLOBAL_EXCHANGE, 'topic', {
      durable: true,
    });
    await this.channel.assertExchange(this.DELAYED_EXCHANGE, 'topic', {
      durable: true,
    });
    await this.channel.assertExchange(this.RETRY_EXCHANGE, 'topic', {
      durable: true,
    });

    // 2. Delayed Queue (The Timer)
    await this.channel.assertQueue(this.DELAYED_QUEUE, {
      durable: true,
      arguments: {
        'x-dead-letter-exchange': this.GLOBAL_EXCHANGE,
        'x-dead-letter-routing-key': this.AUCTION_ENDED_KEY,
      },
    });
    await this.channel.bindQueue(
      this.DELAYED_QUEUE,
      this.DELAYED_EXCHANGE,
      'auction.delayed',
    );

    // 3. Ended Queue (The Main Work Queue)
    await this.channel.assertQueue(this.ENDED_QUEUE, {
      durable: true,
      arguments: {
        // If a message is nack'd here, send it to the retry exchange
        'x-dead-letter-exchange': this.RETRY_EXCHANGE,
        'x-dead-letter-routing-key': 'auction.retry',
      },
    });
    await this.channel.bindQueue(
      this.ENDED_QUEUE,
      this.GLOBAL_EXCHANGE,
      this.AUCTION_ENDED_KEY,
    );

    // 4. Retry Queue (The "Waiting Room")
    await this.channel.assertQueue(this.RETRY_QUEUE, {
      durable: true,
      arguments: {
        'x-message-ttl': 60000, // Wait 60 seconds
        'x-dead-letter-exchange': this.GLOBAL_EXCHANGE, // Then send back to main loop
        'x-dead-letter-routing-key': this.AUCTION_ENDED_KEY,
      },
    });
    await this.channel.bindQueue(
      this.RETRY_QUEUE,
      this.RETRY_EXCHANGE,
      'auction.retry',
    );
  }

  async publishDelayedAuctionEnd(auctionId: string, durationMs: number) {
    if (!this.channel) await this.connect();
    const message = { auctionId };
    this.channel!.publish(
      this.DELAYED_EXCHANGE,
      'auction.delayed',
      Buffer.from(JSON.stringify(message)),
      {
        expiration: Math.max(0, durationMs).toString(),
        persistent: true,
      },
    );
  }

  async consume(queue: string, handler: (msg: any) => Promise<boolean>) {
    if (!this.channel) await this.connect();

    // Process only one message at a time to prevent overloading
    this.channel!.prefetch(1);

    this.channel!.consume(
      queue,
      async (msg: any) => {
        if (!msg) return;
        try {
          const content = JSON.parse(msg.content.toString());
          const success = await handler(content);

          if (success) {
            this.channel!.ack(msg);
          } else {
            // nack(message, requeue: false) -> sends to Dead Letter Exchange (Retry Queue)
            this.channel!.nack(msg, false, false);
          }
        } catch (error) {
          logger.error('Consumer Processing Error', error);
          this.channel!.nack(msg, false, false);
        }
      },
      { noAck: false },
    );
  }

  getEndedQueueName() {
    return this.ENDED_QUEUE;
  }
}
