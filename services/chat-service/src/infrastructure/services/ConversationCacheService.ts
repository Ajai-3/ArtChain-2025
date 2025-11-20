import { TYPES } from "../Inversify/types";
import { inject, injectable } from "inversify";
import { ICacheService } from "../../domain/service/ICacheService";
import { IConversationCacheService } from "../../applications/interface/service/IConversationCacheService";

@injectable()
export class ConversationCacheService implements IConversationCacheService {
  private readonly MESSAGE_TTL_MS = 24 * 60 * 60 * 1000;
  private readonly MAX_CACHE_MESSAGES = 100;

  constructor(
    @inject(TYPES.ICacheService)
    private readonly cacheService: ICacheService
  ) {}

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
