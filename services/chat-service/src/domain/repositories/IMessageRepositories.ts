import { Message } from "../entities/Message";
import { IBaseRepository } from "./IBaseRepositories";

export interface IMessageRepository extends IBaseRepository<Message> {
  listByConversation(conversationId: string): Promise<Message[]>;
  markRead(messageId: string[], userId: string): Promise<void>;
}
