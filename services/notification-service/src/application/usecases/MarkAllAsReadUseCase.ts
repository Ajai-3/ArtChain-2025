import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IMarkAsAllReadUseCase } from "../../domain/usecases/IMarkAllAsReadUseCase";

export class MarkAllAsReadUseCase implements IMarkAsAllReadUseCase {
  constructor(private readonly _notificationRepo: INotificationRepository) {}
  async execute(userId: string): Promise<void> {
    await this._notificationRepo.markAllAsRead(userId);
  }
}
