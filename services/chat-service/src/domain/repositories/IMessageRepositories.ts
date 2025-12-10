import { Message } from "../entities/Message";
import { IBaseRepository } from "./IBaseRepositories";

export interface IMessageRepository extends IBaseRepository<Message> {
  markRead(messageId: string[], userId: string): Promise<void>;
  listByConversationPaginated(
    conversationId: string,
    limit: number,
    fromId?: string,
  ): Promise<Message[]>;
  getLastMessages(conversationIds: string[]): Promise<Message[]>;
  getTotalCountByConversation(conversationId: string): Promise<number>;
  getUnreadCounts(
    conversationIds: string[],
    userId: string
  ): Promise<{ conversationId: string; count: number }[]>;
  markAllRead(conversationId: string, userId: string): Promise<void>;
}
