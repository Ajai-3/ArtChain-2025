import { injectable } from 'inversify';
import { publishNotification } from './rabbitmq'; 
import { IMessagePublisher } from '../../application/interface/messaging/IMessagePublisher';

@injectable()
export class RabbitMQMessagePublisher implements IMessagePublisher {
  async publish(routingKey: string, message: object): Promise<void> {
    await publishNotification(routingKey, message);
  }
}
