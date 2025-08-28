import { prisma } from '../../db/prisma';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { IUserRepository } from '../../../domain/repositories/user/IUserRepository';
import { SafeUser } from '../../../domain/repositories/IBaseRepository';
import { Role } from '@prisma/client';

export class UserRepositoryImpl extends BaseRepositoryImpl implements IUserRepository {
  protected model = prisma.user;

  async findAllUsers({ page, limit }: { page: number; limit: number }): Promise<{
    meta: { page: number; limit: number; total: number };
    data: SafeUser[];
  }> {
    const skip = (page - 1) * limit;

    const where = {
      role: { in: [Role.user, Role.artist] },
    };

    const [total, users] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const sanitizedUsers: SafeUser[] = users.map(({ password, ...rest }) => rest);

    return {
      meta: { page, limit, total },
      data: sanitizedUsers,
    };
  }

  async findManyByIds(ids: string[], page: number, limit: number): Promise<{
    meta: { page: number; limit: number; total: number };
    data: SafeUser[];
  }> {
    const skip = (page - 1) * limit;

    const where = {
      id: { in: ids },
      role: { in: [Role.user, Role.artist] }, 
    };

    const [total, users] = await Promise.all([
      this.model.count({ where }),
      this.model.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const sanitizedUsers: SafeUser[] = users.map(({ password, ...rest }) => rest);

    return {
      meta: { page, limit, total },
      data: sanitizedUsers,
    };
  }
}
