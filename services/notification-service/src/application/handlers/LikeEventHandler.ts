import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { Notification } from "../../domain/entities/Notification";
import { emitToUser } from "../../infrastructure/sockets/socketHandler";
import { logger } from "../../infrastructure/utils/logger";
import { ILikeEventHandler } from "../interfaces/handlers/ILikeEventHandler";

@injectable()
export class LikeEventHandler implements ILikeEventHandler {
  constructor(
    @inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository
  ) {}

  async handle(event: {
    likedUserId: string;
    likerId: string;
    likerName: string;
    likerProfile: string | null;
    createdAt: string;
  }): Promise<void> {
    const notification = new Notification(
      event.likedUserId,
      "like",
      {
        senderId: event.likerId,
        likerName: event.likerName,
        likerProfile: event.likerProfile,
      },
      false,
      new Date(event.createdAt)
    );

    try {
      const savedNotification = await this._notificationRepo.create(notification);
      logger.info(`✅ Like Notification saved: ${JSON.stringify(savedNotification)}`);
      await emitToUser(event.likedUserId, "notification", savedNotification);
    } catch (error) {
      logger.error("Error handling like event", error);
      throw error;
    }
  }
}
