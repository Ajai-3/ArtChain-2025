import { Notification } from "../../domain/entities/Notification";
import {
  NotificationModel,
  NotificationDoc,
} from "../db/models/NotificationModel";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";

export class NotificationRepositoryImp implements INotificationRepository {
  async save(
    notification: Notification
  ): Promise<Notification & { id: string }> {
    const doc: NotificationDoc = await NotificationModel.create(notification);

    return {
      id: doc._id.toString(),
      userId: doc.userId,
      type: doc.type,
      data: doc.data,
      read: doc.read,
      createdAt: doc.createdAt,
    };
  }

  async getUserNotifications(
    userId: string
  ): Promise<(Notification & { id: string })[]> {
    const docs = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map((doc) => ({
      id: (doc as any)._id.toString(),
      userId: doc.userId,
      type: doc.type,
      data: doc.data,
      read: doc.read,
      createdAt: doc.createdAt,
    }));
  }

  async getUnreadCount(userId: string): Promise<number> {
    return NotificationModel.countDocuments({ userId, read: false });
  }

  async markAsRead(id: string): Promise<void> {
    await NotificationModel.findByIdAndUpdate(id, { read: true });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationModel.updateMany({ userId, read: false }, { read: true });
  }
}
