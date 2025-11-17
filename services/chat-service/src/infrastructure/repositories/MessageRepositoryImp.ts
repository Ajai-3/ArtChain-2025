import { injectable } from "inversify";
import { Message } from "../../domain/entities/Message";
import { BaseRepositoryImp } from "./BaseRepositoryImp";
import { IMessageDocument, MessageModel } from "../models/MessageModel";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";

@injectable()
export class MessageRepositoryImp
  extends BaseRepositoryImp<Message, IMessageDocument>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel);
  }

  async listByConversationPaginated(
    conversationId: string,
    limit: number,
    skip: number
  ): Promise<Message[]> {
    const messages = await this.model
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return this.mapDbArrayToDomain(messages.reverse());
  }

  async markRead(messageIds: string[]): Promise<void> {
    await this.model.updateMany({ _id: { $in: messageIds } }, { read: true });
  }

  async getLastMessages(conversationIds: string[]): Promise<Message[]> {
    const rows = await this.model.aggregate([
      { $match: { conversationId: { $in: conversationIds } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$conversationId", doc: { $first: "$$ROOT" } } },
    ]);

    return rows.map((r) => this.mapDbToDomain(r.doc));
  }

  async getUnreadCounts(conversationIds: string[], userId: string) {
    const rows = await this.model.aggregate([
      {
        $match: {
          conversationId: { $in: conversationIds },
          senderId: { $ne: userId },
          readBy: { $ne: userId },
        },
      },
      { $group: { _id: "$conversationId", count: { $sum: 1 } } },
    ]);

    return rows.map((r) => ({
      conversationId: r._id,
      count: Number(r.count),
    }));
  }
} 