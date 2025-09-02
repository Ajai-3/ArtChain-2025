import { Notification } from "../../domain/entities/Notification";
import { NotificationModel } from "../db/models/NotificationModel";

export class NotificationRepositoryImp {
  async save(notification: Notification): Promise<Notification> {
    const doc = await NotificationModel.create(notification);
    return new Notification(
      doc.userId,
      doc.type,
      doc.data,
      doc.read,
      doc.createdAt,
      doc._id.toString()
    );
  }

  async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<Notification[]> {
    const skip = (page - 1) * limit;

    const docs = await NotificationModel.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return docs.map(
      (d) =>
        new Notification(
          d.userId,
          d.type,
          d.data,
          d.read,
          d.createdAt,
          (d as any)._id.toString()
        )
    );
  }

  async getUnreadCount(userId: string) {
    return NotificationModel.countDocuments({ userId, read: false });
  }

  async markAsRead(id: string) {
    await NotificationModel.findByIdAndUpdate(id, { read: true });
  }

  async markAllAsRead(userId: string) {
    await NotificationModel.updateMany({ userId, read: false }, { read: true });
  }
}
