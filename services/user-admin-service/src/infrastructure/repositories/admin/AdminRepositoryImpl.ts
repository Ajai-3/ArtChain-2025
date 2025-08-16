import Role from '@prisma/client';
import { prisma } from '../../db/prisma';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { SafeUser } from '../../../domain/repositories/IBaseRepository';
import { IAdminRepositories } from '../../../domain/repositories/IAdminRepository';


export class AdminRepositoryImpl
  extends BaseRepositoryImpl
  implements IAdminRepositories
{
  protected model = prisma.user;

  async findByRole(role: keyof typeof Role): Promise<SafeUser | null> {
    return this.model.findFirst({
      where: {
        role: Role[role],
      },
    });
  }
}