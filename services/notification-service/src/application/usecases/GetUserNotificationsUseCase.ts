import { GetUserNotificationsDTO } from "../../domain/dto/GetUserNotificationsDTO";
import { Notification } from "../../domain/entities/Notification";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetUserNotificationsUseCase } from "../../domain/usecases/IGetUserNotificationsUseCase";

export class GetUserNotificationsUseCase
  implements IGetUserNotificationsUseCase
{
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  async execute(data: GetUserNotificationsDTO): Promise<Notification[]> {
    const page = data.page ?? 1;
    const limit = data.limit ?? 10;
    return this._notificationRepo.getUserNotifications(
      data.userId,
      page,
      limit
    );
  }
}
