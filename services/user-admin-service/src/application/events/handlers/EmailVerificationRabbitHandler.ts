import { inject, injectable } from "inversify";
import { EventType } from "../../../domain/events/EventType";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IMessagePublisher } from "../../interface/messaging/IMessagePublisher";
import { EmailVerificationEvent } from "../../../domain/events/EmailVerificationEvent";

import { IEventHandler } from "../../interface/events/handlers/IEventHandler";

@injectable()
export class EmailVerificationRabbitHandler implements IEventHandler<EmailVerificationEvent> {
  constructor(
    @inject(TYPES.IMessagePublisher)
    private readonly _messagePublisher: IMessagePublisher
  ) {}

  async handle(event: EmailVerificationEvent) {
    await this._messagePublisher.publish(EventType.EMAIL_VERIFICATION, {
      type: 'VERIFICATION',
      email: event.email,
      payload: {
        name: event.name,
        token: event.token,
        link: event.link,
      },
    });
  }
}