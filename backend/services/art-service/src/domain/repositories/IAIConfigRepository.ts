import { AIConfig } from '../entities/AIConfig';

export interface IAIConfigRepository {
  create(entity: unknown): Promise<AIConfig>;
  getById(id: string): Promise<AIConfig | null>;
  getAll(page?: number, limit?: number): Promise<AIConfig[]>;
  update(id: string, entity: Record<string, unknown>): Promise<AIConfig>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  findByProvider(provider: string): Promise<AIConfig | null>;
  findAll(): Promise<AIConfig[]>;
  findAllEnabled(): Promise<AIConfig[]>;
}
