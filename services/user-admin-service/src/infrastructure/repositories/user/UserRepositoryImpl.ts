import { prisma } from "../../db/prisma";
import { BaseRepositoryImpl } from "../BaseRepositoryImpl";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { SafeUser } from "../../../domain/repositories/IBaseRepository";
import { Role } from "@prisma/client";
import { User } from "../../../domain/entities/User";
import { ArtUser } from "../../../types/ArtUser";

export class UserRepositoryImpl
  extends BaseRepositoryImpl
  implements IUserRepository
{
  protected model = prisma.user;
  async findById(id: string): Promise<SafeUser | null> {
    const user = await this.model.findUnique({ where: { id } });
    return user ? this.toSafeUser(user) : null;
  }

  async findByEmail(email: string): Promise<SafeUser | null> {
    const user = await this.model.findUnique({ where: { email } });
    return user ? this.toSafeUser(user) : null;
  }

  async findByUsername(username: string): Promise<SafeUser | null> {
    const user = await this.model.findUnique({ where: { username } });
    return user ? this.toSafeUser(user) : null;
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
  }): Promise<{ meta: { page: number; limit: number; total: number }; data: SafeUser[] }> {
    const where: any = {
      role: { in: [Role.user, Role.artist] },
    };

    if (role && role !== "all") {
      if (role === "user") where.role = Role.user;
      else if (role === "artist") where.role = Role.artist;
    }

    if (status && status !== "all") where.status = status;
    if (plan && plan !== "all") where.plan = plan;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.model.findMany({ where, skip, take: limit }),
      this.model.count({ where }),
    ]);

    const sanitizedUsers: SafeUser[] = users.map(({ password, ...rest }) => rest);

    return { meta: { page, limit, total }, data: sanitizedUsers };
  }

  async findManyByIds(
    ids: string[],
    page: number,
    limit: number,
    filters?: { role?: string; status?: string; plan?: string }
  ): Promise<{ meta: { page: number; limit: number; total: number }; data: SafeUser[] }> {
    const where: any = {
      id: { in: ids },
      role: { in: [Role.user, Role.artist] },
    };

    if (filters?.role && filters.role !== "all") {
      if (filters.role === "user") where.role = Role.user;
      else if (filters.role === "artist") where.role = Role.artist;
    }

    if (filters?.status && filters.status !== "all") where.status = filters.status;
    if (filters?.plan && filters.plan !== "all") where.plan = filters.plan;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.model.findMany({ where, skip, take: limit }),
      this.model.count({ where }),
    ]);

    const sanitizedUsers: SafeUser[] = users.map(({ password, ...rest }) => rest);

    return { meta: { page, limit, total }, data: sanitizedUsers };
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
        plan: true,
        role: true,
        status: true,
      },
    });

    return users as ArtUser[];
  }
}
