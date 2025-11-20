export interface IConversationCacheService {
  cacheConversationMembers(
    conversationId: string,
    memberIds: string[]
  ): Promise<void>;
  getConversationMembers(conversationId: string): Promise<string[]>;
  updateConversationMembers(
    conversationId: string,
    memberIds: string[]
  ): Promise<void>;
  removeConversationMembers(
    conversationId: string,
    memberIdsToRemove: string[]
  ): Promise<void>;
}
