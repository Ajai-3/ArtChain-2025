import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { Notification } from "../../domain/entities/Notification";
import { GetUserNotificationsDTO } from "../../domain/dto/GetUserNotificationsDTO";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetUserNotificationsUseCase } from "../../domain/usecases/IGetUserNotificationsUseCase";
import { IUserServiceClient } from "../interfaces/clients/IUserServiceClient";

@injectable()
export class GetUserNotificationsUseCase
  implements IGetUserNotificationsUseCase
{
  constructor(
      @inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository,
      @inject(TYPES.IUserServiceClient) private readonly _userServiceClient: IUserServiceClient
  ) {}

  async execute(data: GetUserNotificationsDTO): Promise<Notification[]> {
    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    const notifications = await this._notificationRepo.getUserNotifications(
      data.userId,
      page,
      limit
    );

    const notificationsWithSender = notifications.filter(n => n.data && n.data.senderId);
    
    if (notificationsWithSender.length > 0) {
        const senderIds = [...new Set(notificationsWithSender.map(n => n.data.senderId))];
        const users = await this._userServiceClient.getUsers(senderIds);
        const userMap = new Map(users.map(u => [u.id, u]));

        if(users.length === 0) {
            console.log("no users")
        }

        console.log("users", users);

        notifications.forEach(n => {
            if (n.data && n.data.senderId) {
                const user = userMap.get(n.data.senderId);
                if (user) {
                    n.data = {
                        ...n.data,
                        senderName: user.name || user.username,
                        senderImage: user.profileImage
                    };
                }
            }
        });
    }

    return notifications;
  }
}
