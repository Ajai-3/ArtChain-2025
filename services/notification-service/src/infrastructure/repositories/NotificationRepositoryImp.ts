import { injectable } from "inversify";
import { Notification } from "../../domain/entities/Notification";
import { NotificationModel, NotificationDoc } from "../db/models/NotificationModel";
import { INotificationRepository } from "../../domain/repositories/INotificationRepository";
import { BaseRepository } from "./BaseRepository";

@injectable()
export class NotificationRepositoryImp extends BaseRepository<Notification, NotificationDoc> implements INotificationRepository {
  constructor() {
    super(NotificationModel);
  }

  protected toDomain(doc: NotificationDoc): Notification {
    return new Notification(
        doc.userId,
        doc.senderId,
        doc.type,
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
    const docs = await this._model.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return docs.map(d => this.toDomain(d as unknown as NotificationDoc));
  }

  async getUnreadCount(userId: string) {
    return this._model.countDocuments({ userId, read: false });
  }

  async markAsRead(id: string) {
    await this.update(id, { read: true });
  }

  async markAllAsRead(userId: string) {
    await this._model.updateMany({ userId, read: false }, { read: true });
  }
}
