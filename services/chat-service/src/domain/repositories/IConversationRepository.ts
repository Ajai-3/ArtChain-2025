import { Conversation } from "../entities/Conversation";
import { IBaseRepository } from "./IBaseRepositories";

export interface IConversationRepository extends IBaseRepository<Conversation> {
  findPrivateConversation(
    userA: string,
    userB: string
  ): Promise<Conversation | null>;
  listUserConversations(userId: string): Promise<Conversation[]>;
}
