import { EventType } from './EventType';
import { DomainEvent } from './DomainEvent';
import { SafeUser } from '../entities/User';

export class UserCreatedEvent implements DomainEvent {
  readonly type = EventType.USER_CREATED;
  readonly occurredAt = new Date();

  constructor(public readonly user: SafeUser) {}
}