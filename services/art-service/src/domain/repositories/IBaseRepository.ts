export interface IBaseRepository<T> {
  create(entity: T): Promise<T>;
  getById(id: string): Promise<T | null>;
  getAll(page?: number, limit?: number): Promise<T[]>;
  update(id: string, entity: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}
