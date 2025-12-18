import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IUserServiceClient } from "../../application/interfaces/clients/IUserServiceClient";
import { emitToUser } from "../../infrastructure/sockets/socketHandler";
import { logger } from "../../infrastructure/utils/logger";
import { Notification } from "../../domain/entities/Notification";
import { IGiftEventHandler } from "../interfaces/handlers/IGiftEventHandler";

@injectable()
export class GiftEventHandler implements IGiftEventHandler {
  constructor(
    @inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository,
    @inject(TYPES.IUserServiceClient) private readonly _userServiceClient: IUserServiceClient
  ) {}

  async handle(event: {
    senderId: string;
    receiverId: string;
    amount: number;
    message?: string;
    timestamp: string;
    senderName?: string;
    senderImage?: string;
  }): Promise<void> {
    let { senderName, senderImage } = event;

    // Enrich if missing
    if (!senderName || !senderImage) {
      const user = await this._userServiceClient.getUser(event.senderId);
      if (user) {
        senderName = user.name || user.username;
        senderImage = user.profileImage;
      }
    }

    const notificationData = {
      senderId: event.senderId,
      amount: event.amount,
      message: event.message
    };

    try {
       const notification = new Notification(
        event.receiverId,
        "GIFT_RECEIVED",
        notificationData,
        false, // read
        new Date(event.timestamp)
      );

      // Using create instead of save as per BaseRepo
      const savedNotification = await this._notificationRepo.create(notification);

      logger.info(`🎁 Gift Notification saved for ${event.receiverId}`);

      // Emit Real-time with enriched data
      const realTimeData = {
        ...savedNotification.toJSON(), // Use toJSON if available or spread
        data: {
          ...savedNotification.data,
          senderName,
          senderImage
        }
      };

      await emitToUser(event.receiverId, "notification", realTimeData);
    } catch (error) {
      logger.error("Error handling gift event", error);
      throw error;
    }
  }
}
