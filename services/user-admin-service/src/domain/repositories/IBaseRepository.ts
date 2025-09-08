import { User } from '../entities/User';

export type SafeUser = Omit<User, 'password'>;

export interface IBaseRepository<T = any, U = User, S = SafeUser> {
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<S>;
  update(id: string, data: Partial<T>): Promise<S | null>;
}