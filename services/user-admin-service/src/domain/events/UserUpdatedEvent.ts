import { SafeUser } from '../entities/User';
import { EventType } from './EventType';
import { DomainEvent } from './DomainEvent';

export class UserUpdatedEvent implements DomainEvent {
  readonly type = EventType.USER_UPDATED;
  readonly occurredAt = new Date();

  constructor(public readonly user: SafeUser) {}
}
