import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IMarkAsReadUseCase } from "../../domain/usecases/IMarkAsReadUseCase";

export class MarkAsReadUseCase implements IMarkAsReadUseCase {
  constructor(private readonly _notificationRepo: INotificationRepository) {}
  async execute(id: string): Promise<void> {
    await this._notificationRepo.markAsRead(id);
  }
}
