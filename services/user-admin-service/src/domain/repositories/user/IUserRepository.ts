import { SafeUser } from "../IBaseRepository";
import { IBaseRepository } from "../IBaseRepository";

export interface IUserRepository extends IBaseRepository {
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
