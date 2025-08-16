import { IBaseRepository, SafeUser } from './IBaseRepository';

export interface IAdminRepositories extends IBaseRepository {
  findByRole(role: string): Promise<SafeUser | null>;
}