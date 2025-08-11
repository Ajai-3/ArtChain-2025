import { Prisma } from '@prisma/client';
import { prisma } from '../../db/prisma';
import { User } from '../../../domain/entities/User';
import { BaseRepositoryImpl } from '../BaseRepositoryImpl';
import { SafeUser } from '../../../domain/repositories/IBaseRepository';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';

export class UserRepositoryImpl extends BaseRepositoryImpl implements IUserRepository {
  protected model = prisma.user;
}