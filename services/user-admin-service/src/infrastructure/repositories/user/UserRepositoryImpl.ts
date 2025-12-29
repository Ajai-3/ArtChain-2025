import { Role } from '@prisma/client';
import { injectable } from 'inversify';
import { prisma } from '../../db/prisma';
import { ArtUser } from '../../../types/ArtUser';
import { User, SafeUser } from '../../../domain/entities/User';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { IUserRepository } from '../../../domain/repositories/user/IUserRepository';

@injectable()
export class UserRepositoryImpl
  extends BaseRepositoryImpl<User, SafeUser>
  implements IUserRepository
{
  protected model = prisma.user;

  protected toSafe(user: User): SafeUser {
    const { password, ...safe } = user;
    return safe;
  }

  async findByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.model.findUnique({ where: { email } });
    return user ? this.toSafe(user) : null;
  }

  async findByUsername(username: string): Promise<SafeUser | null> {
    const user = await this.model.findUnique({ where: { username } });
    return user ? this.toSafe(user) : null;
  }

  async findByUsernameRaw(username: string): Promise<User | null> {
    return this.model.findUnique({ where: { username } });
  }

  async findByEmailRaw(email: string): Promise<User | null> {
    return this.model.findUnique({ where: { email } });
  }

  async findByIdRaw(id: string): Promise<User | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAllUsers({
    page,
    limit,
    role,
    status,
    plan,
  }: {
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
  }> {
    const baseWhere: any = {
      role: { in: [Role.user, Role.artist] },
    };

    const where: any = { ...baseWhere };

    if (role && role !== 'all') {
      if (role === 'user') where.role = Role.user;
      else if (role === 'artist') where.role = Role.artist;
    }

    if (status && status !== 'all') where.status = status;
    if (plan && plan !== 'all') where.plan = plan;

    const skip = (page - 1) * limit;

    const [users, total, stats] = await Promise.all([
      this.model.findMany({ where, skip, take: limit }),
      this.model.count({ where }),
      this._getUserStats(baseWhere),
    ]);

    const sanitizedUsers: SafeUser[] = users.map((user: User) => {
        const { password, ...rest } = user;
        return rest;
    });

    return { 
      meta: { page, limit, total }, 
      data: sanitizedUsers,
      stats
    };
  }

  private async _getUserStats(baseWhere: any) {
    const [total, active, banned, artists] = await Promise.all([
      this.model.count({ where: baseWhere }),
      this.model.count({ where: { ...baseWhere, status: 'active' } }),
      this.model.count({ where: { ...baseWhere, status: 'banned' } }),
      this.model.count({ where: { ...baseWhere, role: Role.artist } }),
    ]);

    return {
      total,
      active,
      banned,
      artists,
    };
  }

  async findManyByIds(
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
  }> {
    const baseWhere: any = {
      role: { in: [Role.user, Role.artist] },
    };

    const where: any = {
      ...baseWhere,
      id: { in: ids },
    };

    if (filters?.role && filters.role !== 'all') {
      if (filters.role === 'user') where.role = Role.user;
      else if (filters.role === 'artist') where.role = Role.artist;
    }

    if (filters?.status && filters.status !== 'all') where.status = filters.status;
    if (filters?.plan && filters.plan !== 'all') where.plan = filters.plan;

    const skip = (page - 1) * limit;

    const [users, total, stats] = await Promise.all([
      this.model.findMany({ where, skip, take: limit }),
      this.model.count({ where }),
      this._getUserStats(baseWhere),
    ]);

    const sanitizedUsers: SafeUser[] = users.map((user: User) => {
        const { password, ...rest } = user;
        return rest;
    });

    return { 
      meta: { page, limit, total }, 
      data: sanitizedUsers,
      stats
    };
  }

  async findManyByIdsBatch(ids: string[]): Promise<ArtUser[]> {
    if (!ids.length) return [];

    const users = await this.model.findMany({
      where: {
        id: { in: ids },
        role: { in: [Role.user, Role.artist] },
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        profileImage: true,
        isVerified: true,
        plan: true,
        role: true,
        status: true,
      },
    });

    return users as ArtUser[];
  }
}
