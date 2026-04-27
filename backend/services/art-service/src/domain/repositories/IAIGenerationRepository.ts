import { AIGeneration } from '../entities/AIGeneration';

export interface IAIGenerationRepository {
  create(entity: unknown): Promise<AIGeneration>;
  getById(id: string): Promise<AIGeneration | null>;
  getAll(page?: number, limit?: number): Promise<AIGeneration[]>;
  update(id: string, entity: Record<string, unknown>): Promise<AIGeneration>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  findById(id: string): Promise<AIGeneration | null>;
  findByUserId(userId: string, page: number, limit: number): Promise<AIGeneration[]>;
  countTodayFreeGenerations(userId: string): Promise<number>;
}
