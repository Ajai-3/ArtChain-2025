import { injectable } from 'inversify';
import { prisma } from '../../db/prisma';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { User, SafeUser } from '../../../domain/entities/User';
import { IAdminRepositories } from '../../../domain/repositories/admin/IAdminRepository';

@injectable()
export class AdminRepositoryImpl
  extends BaseRepositoryImpl<User, SafeUser>
  implements IAdminRepositories
{
  protected model = prisma.user;

  protected toSafe(user: User): SafeUser {
    const { password, ...safe } = user;
    return safe;
  }
}
