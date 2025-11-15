import { injectable } from "inversify";
import { Message } from "../../domain/entities/Message";
import { BaseRepositoryImp } from "./BaseRepositoryImp";
import { IMessageDocument, MessageModel } from "../models/MessageMOdel";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";

@injectable()
export class MessageRepositoryImp extends BaseRepositoryImp<Message, IMessageDocument> implements IMessageRepository {
  constructor() {
    super(MessageModel);
  }

  async listByConversation(conversationId: string): Promise<Message[]> {
    const messages = await this.model.find({ conversationId });
    return this.mapDbArrayToDomain(messages);
  }

  async markRead(messageIds: string[]): Promise<void> {
    await this.model.updateMany(
      { _id: { $in: messageIds } },
      { read: true }
    );
  }
}