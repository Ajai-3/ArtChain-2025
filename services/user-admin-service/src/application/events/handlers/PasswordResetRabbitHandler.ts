import { inject, injectable } from "inversify";
import { EventType } from "../../../domain/events/EventType";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IMessagePublisher } from "../../interface/messaging/IMessagePublisher";
import { PasswordResetRequestedEvent } from "../../../domain/events/PasswordResetRequestedEvent";
import { IEventHandler } from "../../interface/events/handlers/IEventHandler";

@injectable()
export class PasswordResetRabbitHandler implements IEventHandler<PasswordResetRequestedEvent> {
  constructor(
      @inject(TYPES.IMessagePublisher)
      private readonly _messagePublisher: IMessagePublisher
  ) {}

  async handle(event: PasswordResetRequestedEvent): Promise<void> {
    await this._messagePublisher.publish(EventType.PASSWORD_RESET_REQUESTED, {
        type: 'PASSWORD_RESET',
        email: event.email,
        payload: {
          name: event.name,
          token: event.token,
          link: event.link,
        },
      });
  }
}
