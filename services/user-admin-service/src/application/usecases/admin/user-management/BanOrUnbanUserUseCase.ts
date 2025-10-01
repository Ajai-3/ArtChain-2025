import { NotFoundError } from 'art-chain-shared';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { SafeUser } from '../../../../domain/repositories/IBaseRepository';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { IBanOrUnbanUserUseCase } from '../../../interface/usecases/admin/user-management/IBanOrUnbanUserUseCase';

export class BanOrUnbanUserUseCase implements IBanOrUnbanUserUseCase {
  constructor(private _userRepository: IUserRepository) {}

  async execute(userId: string): Promise<SafeUser> {
    const user = await this._userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const newStatus = user.status === 'banned' ? 'active' : 'banned';

    const updatedUser = await this._userRepository.update(userId, {
      status: newStatus,
    });

    if (!updatedUser) {
      throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    return updatedUser;
  }
}
