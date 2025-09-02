import { Notification } from "../../domain/entities/Notification";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetUserNotificationsUseCase } from "../../domain/usecases/IGetUserNotificationsUseCase";

export class GetUserNotificationsUseCase
  implements IGetUserNotificationsUseCase
{
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  async execute(userId: string): Promise<Notification[]> {
    const notificarions = await this._notificationRepo.getUserNotifications(userId);
    return notificarions
  }
}
