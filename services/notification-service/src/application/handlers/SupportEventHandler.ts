import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { emitToUser } from "../../infrastructure/sockets/socketHandler";
import { logger } from "../../infrastructure/utils/logger";
import { ISupportEventHandler } from "../interfaces/handlers/ISupportEventHandler";

@injectable()
export class SupportEventHandler implements ISupportEventHandler {
  constructor(
    @inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository
  ) {}

  async handle(event: {
    supportedUserId: string;
    supporterId: string;
    supporterName: string;
    supporterProfile: string | null;
    createdAt: string;
  }): Promise<void> {
    const notification = new Notification(
      event.supportedUserId,
      "support",
      {
        senderId: event.supporterId,
        supporterName: event.supporterName,
        supporterProfile: event.supporterProfile,
      },
      false,
      new Date(event.createdAt)
    );

    try {
      const savedNotification = await this._notificationRepo.create(notification);
      logger.info(`✅ Support Notification saved: ${JSON.stringify(savedNotification)}`);
      await emitToUser(event.supportedUserId, "notification", savedNotification);
    } catch (error) {
      logger.error("Error handling support event", error);
      throw error;
    }
  }
}
