import { injectable } from "inversify";
import { Types } from "mongoose";
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
    fromId?: string
  ): Promise<Message[]> {
    const query: any = { conversationId };
    if (fromId) query._id = { $lt: fromId };

    const messages = await this.model
      .find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    return this.mapDbArrayToDomain(messages);
  }

  async markRead(messageIds: string[], userId: string): Promise<void> {
    try {
      const validIds = messageIds.filter(id => Types.ObjectId.isValid(id));
      if (validIds.length === 0) {
        console.warn("No valid ObjectIds found in messageIds:", messageIds);
        return;
      }

      const result = await this.model.updateMany(
        { _id: { $in: validIds.map(id => new Types.ObjectId(id)) } },
        { 
          $addToSet: { readBy: userId }
        }
      );
      console.log(`Marked ${result.modifiedCount} messages as read for user ${userId}`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
      throw error;
    }
  }

  async getTotalCountByConversation(conversationId: string): Promise<number> {
    return await this.model.countDocuments({
      conversationId,
    });
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

  async markAllRead(conversationId: string, userId: string): Promise<void> {
    try {
      const result = await this.model.updateMany(
        {
           conversationId: conversationId,
           senderId: { $ne: userId }, // Don't mark own messages as read (optional, but good practice)
           readBy: { $ne: userId }
        },
        {
          $addToSet: { readBy: userId }
        }
      );
      console.log(`Marked ${result.modifiedCount} messages as read in conversation ${conversationId} for user ${userId}`);
    } catch (error) {
       console.error("Error marking all messages as read:", error);
       throw error;
    }
  }

  async updateByCallId(callId: string, updates: Partial<Message>): Promise<Message | null> {
    const updatedDoc = await this.model.findOneAndUpdate(
      { callId },
      { $set: updates },
      { new: true }
    ).lean();

    return updatedDoc ? this.mapDbToDomain(updatedDoc) : null;
  }
}
