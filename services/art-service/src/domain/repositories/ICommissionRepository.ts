import { IBaseRepository } from "./IBaseRepository";
import { Commission } from "../entities/Commission";

export interface ICommissionRepository extends IBaseRepository<Commission> {
  findByConversationId(conversationId: string): Promise<Commission | null>;
  findAllByConversationId(conversationId: string): Promise<Commission[]>;
  findByRequesterId(userId: string): Promise<Commission[]>;
  findByArtistId(artistId: string): Promise<Commission[]>;
  findByStatus(status: string): Promise<Commission[]>;
  findRecent(limit: number): Promise<Commission[]>;
  findAllFiltered(filter: any, page: number, limit: number): Promise<{ commissions: Commission[], total: number }>;
  getStats(startDate?: Date, endDate?: Date): Promise<{
    REQUESTED: number;
    NEGOTIATING: number;
    AGREED: number;
    IN_PROGRESS: number;
    COMPLETED: number;
    CANCELLED: number;
    REJECTED: number;
    totalRevenue: number;
    activeDisputes: number;
  }>;
}
