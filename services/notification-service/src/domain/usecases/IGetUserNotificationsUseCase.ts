import { GetUserNotificationsDTO } from '../../application/interfaces/dto/GetUserNotificationsDTO';
import { NotificationResponse } from '../../application/interfaces/dto/NotificationResponse';

export interface IGetUserNotificationsUseCase {
  execute(data: GetUserNotificationsDTO): Promise<NotificationResponse[]>;
}
