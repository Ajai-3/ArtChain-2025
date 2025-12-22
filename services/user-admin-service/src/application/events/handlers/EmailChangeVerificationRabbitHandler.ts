import { inject, injectable } from "inversify";
import { EventType } from "../../../domain/events/EventType";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IMessagePublisher } from "../../interface/messaging/IMessagePublisher";
import { EmailChangeVerificationEvent } from "../../../domain/events/EmailChangeVerificationEvent";
import { IEventHandler } from "../../interface/events/handlers/IEventHandler";

@injectable()
export class EmailChangeVerificationRabbitHandler implements IEventHandler<EmailChangeVerificationEvent> {
  constructor(
    @inject(TYPES.IMessagePublisher)
    private readonly _messagePublisher: IMessagePublisher
  ) {}

  async handle(event: EmailChangeVerificationEvent) {
    await this._messagePublisher.publish(EventType.EMAIL_CHANGE_VERIFICATION, {
      type: 'EMAIL_CHANGE_VERIFICATION',
      email: event.email,
      payload: {
        name: event.name,
        token: event.token,
      },
    });
  }
}