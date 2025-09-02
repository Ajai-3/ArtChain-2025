import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetUnreadCountUseCase } from "../../domain/usecases/IGetUnreadCountUseCase";

export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  execute(userId: string): Promise<number> {
    return this._notificationRepo.getUnreadCount(userId);
  }
}
