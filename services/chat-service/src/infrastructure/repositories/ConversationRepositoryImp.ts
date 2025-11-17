import { injectable } from "inversify";
import { BaseRepositoryImp } from "./BaseRepositoryImp";
import { Conversation, ConversationType } from "../../domain/entities/Conversation";
import { ConversationModel, IConversationDocument } from './../models/ConversationModel';
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";

@injectable()
export class ConversationRepositoryImp
  extends BaseRepositoryImp<Conversation, IConversationDocument>
  implements IConversationRepository
{
  constructor() {
    super(ConversationModel);
  }

  async findPrivateConversation(
    userId: string,
    otherUserId: string
  ): Promise<Conversation | null> {
    const conversation = await this.model.findOne({
      memberIds: [userId, otherUserId],
      type: ConversationType.PRIVATE,
    });
    return this.mapDbToDomain(conversation);
  }

  async listUserConversations(userId: string): Promise<Conversation[]> {
    const conversations = await this.model.find({
      users: { $in: [userId] },
    });
    return this.mapDbArrayToDomain(conversations);
  }
}