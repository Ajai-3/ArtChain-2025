import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { Notification } from "../../domain/entities/Notification";
import { GetUserNotificationsDTO } from "../interfaces/dto/GetUserNotificationsDTO";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetUserNotificationsUseCase } from "../../domain/usecases/IGetUserNotificationsUseCase";
import { IUserServiceClient } from "../interfaces/clients/IUserServiceClient";

import { NotificationResponse } from "../interfaces/dto/NotificationResponse";

@injectable()
export class GetUserNotificationsUseCase
  implements IGetUserNotificationsUseCase
{
  constructor(
      @inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository,
      @inject(TYPES.IUserServiceClient) private readonly _userServiceClient: IUserServiceClient
  ) {}

  async execute(data: GetUserNotificationsDTO): Promise<NotificationResponse[]> {
    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const notifications = await this._notificationRepo.getUserNotifications(
      data.userId,
      page,
      limit
    );

    const responseNotifications: NotificationResponse[] = notifications.map(n => n.toJSON());

    const notificationsWithSender = responseNotifications.filter(n => n.senderId);
    
    if (notificationsWithSender.length > 0) {
        const senderIds = [...new Set(notificationsWithSender.map(n => n.senderId))];
        const users = await this._userServiceClient.getUsers(senderIds);
        const userMap = new Map(users.map(u => [u.id, u]));

        notificationsWithSender.forEach(n => {
            if (n.senderId) {
                 const user = userMap.get(n.senderId);
                if (user) {
                    n.senderName = user.username;
                    n.senderImage = user.profileImage || undefined;
                }
            }
        });
    }

    return responseNotifications;
  }
}
