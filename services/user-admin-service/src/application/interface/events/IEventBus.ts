import { DomainEvent } from '../../../domain/events/DomainEvent';
import { IEventHandler } from './handlers/IEventHandler';

export interface IEventBus {
  publish(event: DomainEvent): Promise<void>;
  register<T extends DomainEvent>(eventType: string, handler: IEventHandler<T>): void;
}