import { inject, injectable } from "inversify";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { ICreateGroupConversationUseCase } from "../interface/usecase/ICreateGroupConversationUseCase";
import { CreateGroupConversationDto } from "../interface/dto/CreateGroupConversationDto";
import {
  Conversation,
  ConversationType,
} from "../../domain/entities/Conversation";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { DeleteMode, MediaType } from "../../domain/entities/Message";
import { DEFAULT_MESSAGES } from "../../constants/messages";
import { IMessageBroadcastService } from "../../domain/service/IMessageBroadcastService";
import { logger } from "../../infrastructure/utils/logger";

@injectable()
export class CreateGroupConversationUseCase
  implements ICreateGroupConversationUseCase
{
  constructor(
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepo: IMessageRepository,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepository: IConversationRepository,
    @inject(TYPES.IMessageBroadcastService)
    private readonly _broadcastService: IMessageBroadcastService
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
    });

    const membersToNotify = allMembers;

    if (membersToNotify.length > 0) {
      await this._broadcastService.publishNewGroupConversation(
        conversation,
        membersToNotify
      );
      logger.info(`Notified ${membersToNotify.length} members of new group conversation`);
    }

    return conversation;
  }
}
