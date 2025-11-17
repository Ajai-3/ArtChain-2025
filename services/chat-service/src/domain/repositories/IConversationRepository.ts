import { Conversation } from "../entities/Conversation";
import { IBaseRepository } from "./IBaseRepositories";

export interface IConversationRepository extends IBaseRepository<Conversation> {
  findPrivateConversation(
    userA: string,
    userB: string
  ): Promise<Conversation | null>;
  listResentByUser(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ conversations: Conversation[]; total: number }>;
}
