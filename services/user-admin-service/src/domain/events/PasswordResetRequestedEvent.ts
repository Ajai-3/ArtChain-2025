import { EventType } from './EventType';
import { DomainEvent } from './DomainEvent';

export class PasswordResetRequestedEvent implements DomainEvent {
  readonly type = EventType.PASSWORD_RESET_REQUESTED;
  readonly occurredAt = new Date();

  constructor(
      public readonly email: string, 
      public readonly name: string, 
      public readonly token: string,
      public readonly link: string
    ) {}
}
