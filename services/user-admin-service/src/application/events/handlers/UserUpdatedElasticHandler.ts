import { inject, injectable } from "inversify";
import { EventType } from "../../../domain/events/EventType";
import { TYPES } from "../../../infrastructure/inversify/types";
import { UserUpdatedEvent } from "../../../domain/events/UserUpdatedEvent";
import { IMessagePublisher } from "../../interface/messaging/IMessagePublisher";

import { IEventHandler } from "../../interface/events/handlers/IEventHandler";

@injectable()
export class UserUpdatedElasticHandler implements IEventHandler<UserUpdatedEvent> {
  constructor(
      @inject(TYPES.IMessagePublisher)
      private readonly _messagePublisher: IMessagePublisher
  ) {}

  async handle(event: UserUpdatedEvent): Promise<void> {
    const user = event.user;
    const elasticUser = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      profileImage: user.profileImage || '',
      bannerImage: user.bannerImage || '',
      bio: user.bio || '',
      role: user.role,
      plan: user.plan,
      status: user.status,
      createdAt: user.createdAt,
    };

    await this._messagePublisher.publish(EventType.USER_UPDATED, elasticUser);
  }
}
