import { DomainEvent } from "../../../../domain/events/DomainEvent";

export interface IEventHandler<T extends DomainEvent> {
  handle(event: T): Promise<void>;
}
