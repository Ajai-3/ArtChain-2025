import { inject, injectable } from "inversify";
import { IMarkMessagesReadUseCase } from "../interface/usecase/IMarkMessagesReadUseCase";
import { TYPES } from "../../infrastructure/Inversify/types";
import { IMessageRepository } from "../../domain/repositories/IMessageRepositories";

import { IMessageCacheService } from "../interface/service/IMessageCacheService";

@injectable()
export class MarkMessagesReadUseCase implements IMarkMessagesReadUseCase {
  constructor(
    @inject(TYPES.IMessageRepository)
    private readonly _messageRepository: IMessageRepository,
    @inject(TYPES.IMessageCacheService)
    private readonly _messageCacheService: IMessageCacheService
  ) {}

  async execute(messageIds: string[], userId: string, conversationId: string): Promise<void> {
    if (!messageIds.length) return;
    console.log(`MarkMessagesReadUseCase: Marking ${messageIds.length} messages as read for user ${userId} in conversation ${conversationId}`);
    await this._messageRepository.markRead(messageIds, userId);
    await this._messageCacheService.invalidateConversationCache(conversationId);
  }
}
