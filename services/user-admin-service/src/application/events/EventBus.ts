import { injectable } from 'inversify';
import { IEventBus } from '../interface/events/IEventBus';
import { DomainEvent } from '../../domain/events/DomainEvent';

import { IEventHandler } from '../interface/events/handlers/IEventHandler';

@injectable()
export class EventBus implements IEventBus {
  private handlers = new Map<string, IEventHandler<any>[]>();

  register<T extends DomainEvent>(eventType: string, handler: IEventHandler<T>): void {
    const list = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, [...list, handler]);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    for (const handler of handlers) {
      await handler.handle(event);
    }
  }
}