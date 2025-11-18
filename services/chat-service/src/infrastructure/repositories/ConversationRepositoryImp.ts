import { injectable } from "inversify";
import { BaseRepositoryImp } from "./BaseRepositoryImp";
import {
  Conversation,
  ConversationType,
} from "../../domain/entities/Conversation";
import {
  ConversationModel,
  IConversationDocument,
} from "./../models/ConversationModel";
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
      memberIds: { $all: [userId, otherUserId] },
      type: ConversationType.PRIVATE,
    });
    return this.mapDbToDomain(conversation);
  }

  async listResentByUser(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const docs = await ConversationModel.find({ memberIds: { $in: [userId] } })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await ConversationModel.countDocuments({
      memberIds: { $in: [userId] },
    });

    const conversations = this.mapDbArrayToDomain(docs);
    return { conversations, total };
  }
}
