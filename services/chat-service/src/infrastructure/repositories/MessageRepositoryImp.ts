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
}