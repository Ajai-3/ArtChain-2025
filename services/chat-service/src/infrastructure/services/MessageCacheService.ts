import { TYPES } from "../Inversify/types";
import { inject, injectable } from "inversify";
import { Message } from "../../domain/entities/Message";
import { ICacheService } from "../../domain/service/ICacheService";
import { IMessageCacheService } from "../../applications/interface/service/IMessageCacheService";

@injectable()
export class MessageCacheService implements IMessageCacheService {
  private readonly MESSAGE_TTL_MS = 24 * 60 * 60 * 1000;
  private readonly MAX_CACHE_MESSAGES = 100;

  constructor(
    @inject(TYPES.ICacheService)
    private readonly cacheService: ICacheService
  ) {}

  async cacheMessage(message: Message): Promise<void> {
    await this.cacheService.set(
      `message:${message.id}`,
      JSON.stringify(message),
      this.MESSAGE_TTL_MS
    );

    const listKey = `messages:${message.conversationId}`;
    await this.cacheService.rpush(listKey, message.id);

    const listLength = await this.cacheService.llen(listKey);
    if (listLength > this.MAX_CACHE_MESSAGES) {
      await this.cacheService.ltrim(listKey, -this.MAX_CACHE_MESSAGES, -1);
    }
  }

  async getCachedMessages(
    conversationId: string,
    limit: number,
    fromId?: string
  ): Promise<Message[]> {
    const listKey = `messages:${conversationId}`;
    const allIds = await this.cacheService.lrange(listKey, 0, -1);
    if (allIds.length === 0) return [];

    let startIndex: number;

    if (!fromId) {
      startIndex = Math.max(0, allIds.length - limit);
    } else {
      const pivotIndex = allIds.indexOf(fromId);
      if (pivotIndex === -1) return [];
      startIndex = pivotIndex + 1;
    }

    const messageIds = allIds.slice(startIndex, startIndex + limit);
    const messagePromises = messageIds.map((id) =>
      this.cacheService.get(`message:${id}`)
    );

    const cachedResults = await Promise.all(messagePromises);
    const messages: Message[] = [];

    for (const cached of cachedResults) {
      if (cached) {
        messages.push(JSON.parse(cached));
      }
    }

    return messages;
  }

  async updateCachedMessage(
    messageId: string,
    updates: Partial<Message>
  ): Promise<void> {
    const cached = await this.cacheService.get(`message:${messageId}`);
    if (!cached) return;

    const cachedMsg = JSON.parse(cached);
    const updatedMessage = { ...cachedMsg, ...updates };

    await this.cacheService.set(
      `message:${messageId}`,
      JSON.stringify(updatedMessage),
      this.MESSAGE_TTL_MS
    );
  }

  async cacheMessageList(
    conversationId: string,
    messages: Message[]
  ): Promise<void> {
    if (messages.length === 0) return;

    const listKey = `messages:${conversationId}`;
    const messageIds = messages.map((msg) => msg.id);

    const cachePromises = messages.map((message) =>
      this.cacheService.set(
        `message:${message.id}`,
        JSON.stringify(message),
        this.MESSAGE_TTL_MS
      )
    );

    await this.cacheService.del(listKey);
    if (messageIds.length > 0) {
      await this.cacheService.rpush(listKey, ...messageIds);
      if (messageIds.length > this.MAX_CACHE_MESSAGES) {
        await this.cacheService.ltrim(listKey, -this.MAX_CACHE_MESSAGES, -1);
      }
    }

    await Promise.all(cachePromises);
  }

  async invalidateConversationCache(conversationId: string): Promise<void> {
    const listKey = `messages:${conversationId}`;
    await this.cacheService.del(listKey);
  }
}
