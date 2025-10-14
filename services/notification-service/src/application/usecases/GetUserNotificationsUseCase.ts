import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { Notification } from "../../domain/entities/Notification";
import { GetUserNotificationsDTO } from "../../domain/dto/GetUserNotificationsDTO";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetUserNotificationsUseCase } from "../../domain/usecases/IGetUserNotificationsUseCase";

@injectable()
export class GetUserNotificationsUseCase
  implements IGetUserNotificationsUseCase
{
  constructor(@inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository) {}

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
