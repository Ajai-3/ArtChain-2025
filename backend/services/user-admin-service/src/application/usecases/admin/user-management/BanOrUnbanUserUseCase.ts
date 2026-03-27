import { inject, injectable } from 'inversify';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { TYPES } from './../../../../infrastructure/inversify/types';
import { SafeUser } from '../../../../domain/entities/User';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { IBanOrUnbanUserUseCase } from '../../../interface/usecases/admin/user-management/IBanOrUnbanUserUseCase';

@injectable()
export class BanOrUnbanUserUseCase implements IBanOrUnbanUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<{ action: string; user: SafeUser }> {
    const existingUser = await this._userRepository.findById(userId);
    if (!existingUser) {
      throw new BadRequestError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const newStatus = existingUser.status === 'banned' ? 'active' : 'banned';

    const user = await this._userRepository.update(userId, {
      status: newStatus,
    });

    if (!user) {
      throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const action = user.status === 'banned' ? 'banned' : 'unbanned';

    return { action, user };
  }
}
