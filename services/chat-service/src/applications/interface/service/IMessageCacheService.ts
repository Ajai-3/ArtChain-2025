import { Message } from "../../../domain/entities/Message";

export interface IMessageCacheService {
  cacheMessage(message: Message): Promise<void>;
  getCachedMessages(
    conversationId: string,
    limit: number,
    fromId?: string
  ): Promise<Message[]>;
  updateCachedMessage(
    messageId: string,
    updates: Partial<Message>
  ): Promise<void>;
  cacheMessageList(conversationId: string, messages: Message[]): Promise<void>;
  invalidateConversationCache(conversationId: string): Promise<void>;
}
