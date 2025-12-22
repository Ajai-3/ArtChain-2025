import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { NotificationType } from "../../domain/enums/NotificationType";
import { emitToUser } from "../../infrastructure/sockets/socketHandler";
import { logger } from "../../infrastructure/utils/logger";
import { ILikeEventHandler } from "../interfaces/handlers/ILikeEventHandler";

@injectable()
export class LikeEventHandler implements ILikeEventHandler {
  constructor(
    @inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository
  ) {}

  async handle(event: {
    userId: string;
    senderId: string;
    senderName: string;
    senderProfile: string | null;
    createdAt: string;
  }): Promise<void> {
    const notification = new Notification(
      event.userId,
      event.senderId,
      NotificationType.LIKE,
      false,
      new Date(event.createdAt)
    );

    try {
      const savedNotification = await this._notificationRepo.create(notification);
      logger.info(`✅ Like Notification saved: ${JSON.stringify(savedNotification)}`);
      const realTimeData = {
        ...savedNotification.toJSON(),
        senderName: event.senderName,
        senderImage: event.senderProfile
      };
      await emitToUser(event.userId, "notification", realTimeData);
    } catch (error) {
      logger.error("Error handling like event", error);
      throw error;
    }
  }
}
