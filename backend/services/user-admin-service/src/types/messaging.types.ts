export interface AmqpConnection {
  createChannel(): Promise<AmqpChannel>;
}

export interface AmqpChannel {
  assertQueue(queue: string, options?: QueueOptions): Promise<QueueAssertionResult>;
  consume(queue: string, callback: (msg: AmqpMessage | null) => void): Promise<ConsumeResult>;
  ack(msg: AmqpMessage): void;
  nack(msg: AmqpMessage, allUpTo?: boolean, requeue?: boolean): void;
  close(): Promise<void>;
}

export interface QueueOptions {
  durable?: boolean;
  autoDelete?: boolean;
  exclusive?: boolean;
  arguments?: Record<string, unknown>;
}

export interface QueueAssertionResult {
  queue: string;
  messageCount: number;
  consumerCount: number;
}

export interface ConsumeResult {
  consumerTag: string;
}

export interface AmqpMessage {
  content: Buffer;
  fields: {
    deliveryTag: number;
    redelivered: boolean;
    exchange: string;
    routingKey: string;
  };
  properties: MessageProperties;
}

export interface MessageProperties {
  contentType?: string;
  contentEncoding?: string;
  headers?: Record<string, unknown>;
  deliveryMode?: number;
  priority?: number;
  correlationId?: string;
  replyTo?: string;
  expiration?: string;
  messageId?: string;
  timestamp?: number;
  type?: string;
  userId?: string;
  appId?: string;
}

export interface MessageHandler {
  (msg: AmqpMessage | null): Promise<void>;
}

export interface DLQHandlerParams {
  conn: AmqpConnection;
  ch: AmqpChannel;
  maxRetries: number;
  retryDelay: number;
}