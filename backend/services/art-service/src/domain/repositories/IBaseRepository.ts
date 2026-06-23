export interface IBaseRepository<T> {
  count(): Promise<number>;
  create(entity: unknown): Promise<T>;
  getById(id: string): Promise<T | null>;
  getAll(page?: number, limit?: number): Promise<T[]>;
  update(id: string, entity: Record<string, unknown>): Promise<T>;
  delete(id: string): Promise<void>;
}
