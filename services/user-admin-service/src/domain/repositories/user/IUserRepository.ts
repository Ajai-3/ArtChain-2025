import { ArtUser } from '../../../types/ArtUser';
import { User, SafeUser } from '../../entities/User';
import { IBaseRepository } from '../IBaseRepository';

export interface IUserRepository<U = User, S = SafeUser>
  extends IBaseRepository<U, S> {

  findById(id: string): Promise<S | null>;
  findByUsernameRaw(username: string): Promise<U | null>;
  findByEmailRaw(email: string): Promise<U | null>;
  findByIdRaw(id: string): Promise<U | null>;
  findByEmail(email: string): Promise<S | null>;
  findByUsername(username: string): Promise<S | null>;
  findAllUsers(query: {
    page: number;
    limit: number;
    role?: string;
    status?: string;
    plan?: string;
  }): Promise<{
    meta: { page: number; limit: number; total: number };
    data: SafeUser[];
    stats?: {
      total: number;
      active: number;
      banned: number;
      artists: number;
    }
  }>;

  findManyByIds(
    ids: string[],
    page: number,
    limit: number,
    filters?: { role?: string; status?: string; plan?: string }
  ): Promise<{
    meta: { page: number; limit: number; total: number };
    data: SafeUser[];
    stats?: {
      total: number;
      active: number;
      banned: number;
      artists: number;
    }
  }>;

  findManyByIdsBatch(ids: string[]): Promise<ArtUser[]>;
}
