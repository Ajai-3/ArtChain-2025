import { IEventHandler } from "./handlers/IEventHandler";
import { DomainEvent } from "../../../domain/events/DomainEvent";

export interface IEventBus {
    register<T extends DomainEvent>(eventType: string, handler: IEventHandler<T>): void;
    publish(event: DomainEvent): Promise<void>;
}