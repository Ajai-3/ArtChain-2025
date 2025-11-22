export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<T | null>;
  update(id: string, item: Partial<T>): Promise<T>;
  create(item: Omit<T, "id" | "createdAt" | "updatedAt">): Promise<T>;
}