import { prisma } from "../../db/prisma";
import { BaseRepositoryImpl } from "../BaseRepositoryImpl";
import { IUserRepository } from "../../../domain/repositories/user/IUserRepository";
import { SafeUser } from "../../../domain/repositories/IBaseRepository";
import { Role } from "@prisma/client";
import { User } from "../../../domain/entities/User";

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
  }: {
    page: number;
    limit: number;
  }): Promise<{
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
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const sanitizedUsers: SafeUser[] = users.map(
      ({ password, ...rest }) => rest
    );

    return {
      meta: { page, limit, total },
      data: sanitizedUsers,
    };
  }

  async findManyByIds(
    ids: string[],
    page: number,
    limit: number
  ): Promise<{
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
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const sanitizedUsers: SafeUser[] = users.map(
      ({ password, ...rest }) => rest
    );

    return {
      meta: { page, limit, total },
      data: sanitizedUsers,
    };
  }
}
