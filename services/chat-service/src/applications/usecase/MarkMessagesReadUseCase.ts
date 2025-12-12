import { inject, injectable } from "inversify";
import { IMarkMessagesReadUseCase } from "../interface/usecase/IMarkMessagesReadUseCase";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";
import { IConversationRepository } from "../../domain/repositories/IConversationRepository";
import { IMessageCacheService } from "../interface/service/IMessageCacheService";
import { BadRequestError } from "art-chain-shared";
import { ERROR_MESSAGES } from "../../constants/messages";

@injectable()
export class MarkMessagesReadUseCase implements IMarkMessagesReadUseCase {
  constructor(
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepository: IMessageRepository,
    @inject(TYPES.IMessageCacheService)
    private readonly _messageCacheService: IMessageCacheService,
    @inject(TYPES.IConversationRepository)
    private readonly _conversationRepo: IConversationRepository
  ) {}

  async execute(messageIds: string[], userId: string, conversationId: string): Promise<void> {
    const conversation = await this._conversationRepo.findById(conversationId);
    if (!conversation) {
      throw new BadRequestError(ERROR_MESSAGES.CONVERSATION_NOT_FOUND);
    }

    if (!conversation.memberIds.includes(userId)) {
      throw new BadRequestError("You are not a member of this conversation");
    }

    if (!messageIds || messageIds.length === 0) {
        console.log(`MarkMessagesReadUseCase: Marking ALL messages as read for user ${userId} in conversation ${conversationId}`);
        await this._messageRepository.markAllRead(conversationId, userId);
    } else {
        console.log(`MarkMessagesReadUseCase: Marking ${messageIds.length} messages as read for user ${userId} in conversation ${conversationId}`);
        await this._messageRepository.markRead(messageIds, userId);
    }
    
    await this._messageCacheService.invalidateConversationCache(conversationId);
  }
}
