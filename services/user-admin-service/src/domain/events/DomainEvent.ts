import { EventType } from './EventType';

export interface DomainEvent {
  readonly type: EventType;
  readonly occurredAt: Date;
}    