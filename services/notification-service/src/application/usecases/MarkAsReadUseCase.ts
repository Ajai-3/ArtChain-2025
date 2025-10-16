import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { IMarkAsReadUseCase } from "../../domain/usecases/IMarkAsReadUseCase";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";

@injectable()
export class MarkAsReadUseCase implements IMarkAsReadUseCase {
  constructor(@inject(TYPES.INotificationRepository) private readonly _notificationRepo: INotificationRepository) {}
  async execute(id: string): Promise<void> {
    await this._notificationRepo.markAsRead(id);
  }
}
