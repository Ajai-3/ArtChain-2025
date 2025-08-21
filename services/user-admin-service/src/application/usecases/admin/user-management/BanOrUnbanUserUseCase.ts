import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';

export class BanOrUnbanUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const newStatus = user.status === 'banned' ? 'active' : 'banned';

    const updatedUser = await this.userRepository.update(userId, {
      status: newStatus,
    });

    return updatedUser;
  }
}