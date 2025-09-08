import { User } from "../../entities/User";
import { SafeUser } from "../IBaseRepository";
import { IBaseRepository } from "../IBaseRepository";

export interface IUserRepository<U = User, S = SafeUser>
  extends IBaseRepository {
  findById(id: string): Promise<S | null>;
  findByUsernameRaw(username: string): Promise<U | null>;
  findByEmailRaw(email: string): Promise<U | null>;
  findByIdRaw(id: string): Promise<U | null>;
  findByEmail(email: string): Promise<S | null>;
  findByUsername(username: string): Promise<S | null>;
  findAllUsers(query: { page: number; limit: number }): Promise<{
    meta: { page: number; limit: number; total: number };
    data: SafeUser[];
  }>;

  findManyByIds(
    ids: string[],
    page: number,
    limit: number
  ): Promise<{
    meta: { page: number; limit: number; total: number };
    data: SafeUser[];
  }>;
}
