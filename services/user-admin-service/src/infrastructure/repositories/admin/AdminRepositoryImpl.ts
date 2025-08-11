import { prisma } from '../../db/prisma';
import { User } from '../../../domain/entities/User';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { SafeUser } from '../../../domain/repositories/IBaseRepository';
import { IAdminRepositories } from '../../../domain/repositories/IAdminRepository';
import Role from '@prisma/client';


export class AdminRepositoryImpl
  extends BaseRepositoryImpl
  implements IAdminRepositories
{
  protected model = prisma.user;

  async findByRole(role: keyof typeof Role): Promise<User | null> {
    return this.model.findFirst({
      where: {
        role: Role[role],
      },
    });
  }
}