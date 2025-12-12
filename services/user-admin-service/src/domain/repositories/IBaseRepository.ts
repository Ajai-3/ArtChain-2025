export interface IBaseRepository<T, S = T> {
  create(data: Partial<T>): Promise<S>;
  update(id: string, data: Partial<T>): Promise<S | null>;
  delete(id: string): Promise<boolean>;
  findById(id: string): Promise<S | null>;
  findAll(): Promise<S[]>;
}