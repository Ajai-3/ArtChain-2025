import { inject, injectable } from "inversify";
import { UserSupportedEvent } from "../../../domain/events/UserSupportedEvent";
import { EventType } from "../../../domain/events/EventType";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IMessagePublisher } from "../../interface/messaging/IMessagePublisher";

@injectable()
export class UserSupportedRabbitHandler {
  constructor(
      @inject(TYPES.IMessagePublisher)
      private readonly _messagePublisher: IMessagePublisher
  ) {}

  async handle(event: UserSupportedEvent) {
    await this._messagePublisher.publish(EventType.USER_SUPPORTED, {
      userId: event.targetUserId,
      senderId: event.supporterId,
      senderName: event.supporterName,
      senderProfile: event.supporterProfile,
      createdAt: event.occurredAt,
    });
  }
}
