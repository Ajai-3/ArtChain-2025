import { Notification } from "../entities/Notification";

export interface IGetUserNotificationsUseCase {
    execute(userId: string): Promise<Notification[]>
}