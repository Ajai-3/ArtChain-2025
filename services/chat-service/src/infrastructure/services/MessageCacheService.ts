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
    limit: number,
    fromId?: string
  ): Promise<Message[]> {
    const listKey = `messages:${conversationId}`;
    const allIds = await this.cacheService.lrange(listKey, 0, -1);
    if (allIds.length === 0) return [];

    let startIndex: number;

    if (!fromId) {
      startIndex = 0;
    } else {
      const pivotIndex = allIds.indexOf(fromId);
      if (pivotIndex === -1) {
        return [];
      }
      startIndex = pivotIndex + 1;
    }

    const endIndex = startIndex + limit - 1;

    const messageIds = allIds.slice(startIndex, endIndex + 1);

    const messages: Message[] = [];
    for (const id of messageIds) {
      const cached = await this.cacheService.get(`message:${id}`);
      if (cached) messages.push(JSON.parse(cached));
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
    await this.cacheService.del(cacheKey);

    if (messages.length > 0) {
      for (const message of messages) {
        await this.cacheMessage(message);
      }
    }
  }

  async cacheConversationMembers(
    conversationId: string,
    memberIds: string[]
  ): Promise<void> {
    await this.cacheService.set(
      `conversation:members:${conversationId}`,
      JSON.stringify(memberIds),
      this.MESSAGE_TTL_MS
    );
  }

  async getConversationMembers(conversationId: string): Promise<string[]> {
    const cached = await this.cacheService.get(
      `conversation:members:${conversationId}`
    );
    return cached ? JSON.parse(cached) : [];
  }

  async removeConversationMembers(
    conversationId: string,
    memberIdsToRemove: string[]
  ): Promise<void> {
    const existingMembers = await this.getConversationMembers(conversationId);

    const updatedMembers = existingMembers.filter(
      (id) => !memberIdsToRemove.includes(id)
    );

    await this.cacheService.set(
      `conversation:members:${conversationId}`,
      JSON.stringify(updatedMembers),
      this.MESSAGE_TTL_MS
    );
  }
  async updateConversationMembers(
    conversationId: string,
    memberIds: string[]
  ): Promise<void> {
    const existingMembers = await this.getConversationMembers(conversationId);
    const updatedMembers = Array.from(
      new Set([...existingMembers, ...memberIds])
    );

    await this.cacheService.set(
      `conversation:members:${conversationId}`,
      JSON.stringify(updatedMembers),
      this.MESSAGE_TTL_MS
    );
  }
}
