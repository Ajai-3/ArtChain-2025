import { prisma } from '../../db/prisma';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class UserRepositoryImpl extends BaseRepositoryImpl implements IUserRepository {
  protected model = prisma.user;
}