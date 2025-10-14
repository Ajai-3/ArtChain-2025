import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { IMarkAsAllReadUseCase } from "../../domain/usecases/IMarkAllAsReadUseCase";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";

@injectable()
export class MarkAllAsReadUseCase implements IMarkAsAllReadUseCase {
  constructor(@inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository) {}
  async execute(userId: string): Promise<void> {
    await this._notificationRepo.markAllAsRead(userId);
  }
}
