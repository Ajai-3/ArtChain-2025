import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { ConversationType } from "../../domain/entities/Conversation";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { CreatePrivateConversationDto } from "../interface/dto/CreatePrivateConversationDto";
import { ICreatePrivateConversationUseCase } from "../interface/usecase/ICreatePrivateConversationUseCase";

@injectable()
export class CreatePrivateConversationUseCase
  implements ICreatePrivateConversationUseCase
{
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(dto: CreatePrivateConversationDto): Promise<string> {
    const { userId, otherUserId } = dto;
    let conversation = await this._conversationRepo.findPrivateConversation(
      userId,
      otherUserId
    );

    if (!conversation) {
      conversation = await this._conversationRepo.create({
        type: ConversationType.PRIVATE,
        memberIds: [userId, otherUserId],
        locked: false,
        adminIds: [],
      });
    }

    return conversation.id;
  }
}
