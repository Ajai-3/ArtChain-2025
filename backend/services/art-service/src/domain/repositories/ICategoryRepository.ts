import { Category } from '../entities/Category';

export interface ICategoryRepository {
  create(entity: unknown): Promise<Category>;
  getById(id: string): Promise<Category | null>;
  getAll(page?: number, limit?: number): Promise<Category[]>;
  update(id: string, entity: Record<string, unknown>): Promise<Category>;
  delete(id: string): Promise<void>;
  count(): Promise<number>;
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  getAllCategory(page: number, limit: number, search?: string, status?: string, countFilter?: number): Promise<{data: Category[], total: number, stats: { total: number; active: number; inactive: number; lowUsage: number; }}>;
  getCategoriesByIds(ids: string[]): Promise<Category[]>;
}