import { inject, injectable } from 'inversify';
import { BadRequestError } from 'art-chain-shared';
import { ERROR_MESSAGES } from '../../constants/messages';
import { logger } from '../../infrastructure/utils/logger';
import { CHAT_MESSAGE } from '../../constants/ChatMessages';
import { TYPES } from '../../infrastructure/Inversify/types';
import { IMessageCacheService } from '../interface/service/IMessageCacheService';
import { IMessageRepository } from '../../domain/repositories/IMessageRepositories';
import { IMarkMessagesReadUseCase } from '../interface/usecase/IMarkMessagesReadUseCase';
import { IConversationRepository } from '../../domain/repositories/IConversationRepository';

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
      throw new BadRequestError(CHAT_MESSAGE.NOT_A_MEMBER_OF_CONVERSATION);
    }

    if (!messageIds || messageIds.length === 0) {
        logger.info(`MarkMessagesReadUseCase: Marking ALL messages as read for user ${userId} in conversation ${conversationId}`);
        await this._messageRepository.markAllRead(conversationId, userId);
    } else {
        logger.info(`MarkMessagesReadUseCase: Marking ${messageIds.length} messages as read for user ${userId} in conversation ${conversationId}`);
        await this._messageRepository.markRead(messageIds, userId);
    }
    
    await this._messageCacheService.invalidateConversationCache(conversationId);
  }
}
