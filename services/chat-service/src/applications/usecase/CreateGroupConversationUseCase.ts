import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { ICreateGroupConversationUseCase } from "../interface/usecase/ICreateGroupConversationUseCase";
import { CreateGroupConversationDto } from "../interface/dto/CreateGroupConversationDto";
import { Conversation, ConversationType } from "../../domain/entities/Conversation";

@injectable()
export class CreateGroupConversationUseCase implements ICreateGroupConversationUseCase {
  constructor(
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepository: IConversationRepository
  ) {}

  async execute(dto: CreateGroupConversationDto): Promise<Conversation> {
    const { userId, name, memberIds } = dto;

    const allMembers = Array.from(new Set([...memberIds, userId]));

    const conversation = await this._conversationRepository.create({
      type: ConversationType.GROUP,
      memberIds: allMembers,
      ownerId: userId, 
      name: name,
      adminIds: [userId], 
      locked: false, 
  })

    return conversation;
  }
}
