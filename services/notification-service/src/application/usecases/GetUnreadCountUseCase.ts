import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/inversify/types";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { IGetUnreadCountUseCase } from "../../domain/usecases/IGetUnreadCountUseCase";

@injectable()
export class GetUnreadCountUseCase implements IGetUnreadCountUseCase {
  constructor(
    @inject(TYPES.INotificationRepository)
    private readonly _notificationRepo: INotificationRepository
  ) {}

  execute(userId: string): Promise<number> {
    return this._notificationRepo.getUnreadCount(userId);
  }
}
