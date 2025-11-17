import { Message } from "../entities/Message";
import { IBaseRepository } from "./IBaseRepositories";

export interface IMessageRepository extends IBaseRepository<Message> {
  markRead(messageId: string[], userId: string): Promise<void>;
  listByConversationPaginated(
    conversationId: string,
    limit: number,
    skip: number
  ): Promise<Message[]>;
  getLastMessages(conversationIds: string[]): Promise<Message[]>;
  getUnreadCounts(conversationIds: string[], userId: string): Promise<{ conversationId: string, count: number }[]>;
}
