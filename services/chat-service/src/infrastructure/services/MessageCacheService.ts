import { TYPES } from "../Inversify/types";
import { inject, injectable } from "inversify";
import { Message } from "../../domain/entities/Message";
import { ICacheService } from "../../domain/service/ICacheService";
import { IMessageCacheService } from "../../applications/interface/service/IMessageCacheService";

@injectable()
export class MessageCacheService implements IMessageCacheService {
  private readonly MESSAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_MESSAGES = 100;

  constructor(
    @inject(TYPES.ICacheService)
    private readonly cacheService: ICacheService
  ) {}

  async cacheMessage(message: Message): Promise<void> {
    // Cache individual message
    await this.cacheService.set(
      `message:${message.id}`,
      JSON.stringify(message),
      this.MESSAGE_TTL_MS
    );

    // Add to conversation message list
    await this.cacheService.rpush(
      `messages:${message.conversationId}`,
      message.id
    );
    await this.cacheService.ltrim(
      `messages:${message.conversationId}`,
      -this.MAX_CACHE_MESSAGES,
      -1
    );
  }

  async getCachedMessages(
    conversationId: string,
    start: number,
    end: number
  ): Promise<Message[]> {
    const cacheKey = `messages:${conversationId}`;
    const messageIds = await this.cacheService.lrange(cacheKey, start, end);

    const messages: Message[] = [];

    for (const messageId of messageIds) {
      const cached = await this.cacheService.get(`message:${messageId}`);
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
    const cacheKey = `messages:${conversationId}`;

    // Clear existing list
    await this.cacheService.del(cacheKey);

    if (messages.length > 0) {
      // Add all messages to cache
      for (const message of messages) {
        await this.cacheMessage(message);
      }
    }
  }
}
