import { Notification } from "../entities/Notification";

export interface INotificationRepository {
  save(notification: Notification): Promise<Notification>;
  getUserNotifications(userId: string, page: number, limit: number): Promise<Notification[]>;
  getUnreadCount(userId: string): Promise<number>;
  markAsRead(id: string): Promise<void>;
  markAllAsRead(userId: string): Promise<void>;
}