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

  // Renaming save to create to match BaseRepository or keeping alias if interface requires.
  // Interface extends IBaseRepository which has create. 
  // Old save method logic is essentially create.
  // Override create if specialized logic needed, but BaseRepo create uses model.create.
  // NotificationModel.create(item) expects item shape. 
  
  protected toDomain(doc: NotificationDoc): Notification {
    return new Notification(
        doc.userId,
        doc.type,
        doc.data,
        doc.read,
        doc.createdAt,
        doc._id.toString()
    );
  }

  // The base create method expects T (Notification). 
  // Notification class might have methods/properties that Mongoose create doesn't like?
  // NotificationModel.create takes object matching schema. 
  // Notification class structure matches schema roughly.
  // Let's ensure create method works.

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

    // docs here are POJOs from lean(), need casting or careful mapping.
    // NotificationDoc structure matches.
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
