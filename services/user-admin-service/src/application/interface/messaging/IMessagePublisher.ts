export interface IMessagePublisher {
  publish(routingKey: string, message: object): Promise<void>;
}
