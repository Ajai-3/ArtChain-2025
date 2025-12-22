import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IUserServiceClient } from "../../application/interfaces/clients/IUserServiceClient";
import { emitToUser } from "../../infrastructure/sockets/socketHandler";
import { logger } from "../../infrastructure/utils/logger";
import { Notification } from "../../domain/entities/Notification";
import { NotificationType } from "../../domain/enums/NotificationType";
import { IGiftEventHandler } from "../interfaces/handlers/IGiftEventHandler";

@injectable()
export class GiftEventHandler implements IGiftEventHandler {
  constructor(
    @inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository,
    @inject(TYPES.IUserServiceClient) private readonly _userServiceClient: IUserServiceClient
  ) {}

  async handle(event: {
    userId: string;
    senderId: string;
    amount: number;
    senderName?: string;
    senderImage?: string;
  }): Promise<void> {
    try {
       const notification = new Notification(
        event.userId,
        event.senderId,
        NotificationType.GIFT_RECEIVED,
        false, 
      );

      const savedNotification = await this._notificationRepo.create(notification);

      logger.info(`🎁 Gift Notification saved for ${event.userId}`);


      const realTimeData = {
        ...savedNotification.toJSON(),
        senderName: event.senderName,
        senderImage: event.senderImage
      };

      await emitToUser(event.userId, "notification", realTimeData);
    } catch (error) {
      logger.error("Error handling gift event", error);
      throw error;
    }
  }
}
