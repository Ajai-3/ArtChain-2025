import { EventType } from './EventType';
import { DomainEvent } from './DomainEvent';

export class UserSupportedEvent implements DomainEvent {
  readonly type = EventType.USER_SUPPORTED;
  readonly occurredAt = new Date();

  constructor(
    public readonly targetUserId: string,
    public readonly supporterId: string,
    public readonly supporterName: string,
    public readonly supporterProfile?: string
  ) {}
}