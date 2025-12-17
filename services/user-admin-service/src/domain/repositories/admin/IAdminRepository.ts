import { IBaseRepository } from '../IBaseRepository';
import { SafeUser, User } from '../../entities/User';

export interface IAdminRepositories extends IBaseRepository<User, SafeUser> {
}