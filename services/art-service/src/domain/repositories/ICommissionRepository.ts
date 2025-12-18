import { IBaseRepository } from "./IBaseRepository";
import { Commission } from "../entities/Commission";

export interface ICommissionRepository extends IBaseRepository<Commission> {
  findByConversationId(conversationId: string): Promise<Commission | null>;
  findAllByConversationId(conversationId: string): Promise<Commission[]>;
  findByRequesterId(userId: string): Promise<Commission[]>;
  findByArtistId(artistId: string): Promise<Commission[]>;
  findByStatus(status: string): Promise<Commission[]>;
  findAllFiltered(filter: any, page: number, limit: number): Promise<{ commissions: Commission[], total: number }>;
}
