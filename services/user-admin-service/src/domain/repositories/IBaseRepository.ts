import { User } from '../entities/User';

export type SafeUser = Omit<User, 'password'>;

export interface IBaseRepository<T = any, U = User, S = SafeUser> {
  create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<S>;
  findById(id: string): Promise<S | null>;
  findByUsernameRaw(username: string): Promise<U | null>; 
  findByEmailRaw(email: string): Promise<U | null>; 
  findByIdRaw(id: string): Promise<U | null>
  findByEmail(email: string): Promise<S | null>;
  findByUsername(username: string): Promise<S | null>;
  update(id: string, data: Partial<T>): Promise<S | null>;
}