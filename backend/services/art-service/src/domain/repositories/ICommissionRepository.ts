import { Commission } from '../entities/Commission';
import type { MongoQuery } from '../../types/mongo';

export interface ICommissionRepository {
  create(entity: unknown): Promise<Commission>;
  getById(id: string): Promise<Commission | null>;
  getAll(page?: number, limit?: number): Promise<Commission[]>;
  update(id: string, entity: Record<string, unknown>): Promise<Commission>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  findByConversationId(conversationId: string): Promise<Commission | null>;
  findAllByConversationId(conversationId: string): Promise<Commission[]>;
  findByRequesterId(userId: string): Promise<Commission[]>;
  findByArtistId(artistId: string): Promise<Commission[]>;
  findByStatus(status: string): Promise<Commission[]>;
  findRecent(limit: number): Promise<Commission[]>;
  findByRequesterIdAndArtistId(requesterId: string, artistId: string): Promise<Commission[]>;
  findAllFiltered(
    filter: MongoQuery,
    page: number,
    limit: number,
  ): Promise<{ commissions: Commission[]; total: number }>;
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
