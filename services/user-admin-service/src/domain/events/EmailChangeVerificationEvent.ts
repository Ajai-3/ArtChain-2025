import { EventType } from './EventType';
import { DomainEvent } from './DomainEvent';

export class EmailChangeVerificationEvent implements DomainEvent {
  readonly type = EventType.EMAIL_CHANGE_VERIFICATION;
  readonly occurredAt = new Date();

  constructor(
    public readonly email: string,
    public readonly name: string,
    public readonly token: string
  ) {}
}