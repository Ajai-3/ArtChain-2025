import { User } from '../entities/User';
import { IBaseRepository } from './IBaseRepository';

export interface IAdminRepositories extends IBaseRepository<User> {
  findByRole(role: string): Promise<User | null>;
}