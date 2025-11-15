import { injectable } from "inversify";
import { BaseRepositoryImp } from "./BaseRepositoryImp";
import { Conversation } from "../../domain/entities/Conversation";
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
    userA: string,
    userB: string
  ): Promise<Conversation | null> {
    const conversation = await this.model.findOne({
      users: { $all: [userA, userB] },
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