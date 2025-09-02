import { Notification } from "../entities/Notification";
import { GetUserNotificationsDTO } from './../dto/GetUserNotificationsDTO';

export interface IGetUserNotificationsUseCase {
  execute(data: GetUserNotificationsDTO): Promise<Notification[]>;
}
