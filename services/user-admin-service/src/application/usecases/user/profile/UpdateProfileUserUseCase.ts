import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { BadRequestError, ERROR_MESSAGES, NotFoundError } from 'art-chain-shared';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { UpdateUserProfileDto } from '../../../interface/dtos/user/profile/UpdateUserProfileDto';
import { IUpdateProfileUserUseCase } from '../../../interface/usecases/user/profile/IUpdateProfileUserUseCase';

@injectable()
export class UpdateProfileUserUseCase implements IUpdateProfileUserUseCase {
  constructor(@inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository) {}

  async execute(dto: UpdateUserProfileDto): Promise<any> {
    const { userId, username, ...updateData } = dto;

    const user = await this._userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (username && username !== user.username) {
      const existingUser = await this._userRepo.findByUsername(username);
      if (existingUser) {
        throw new BadRequestError(ERROR_MESSAGES.DUPLICATE_USERNAME);
      }
    }

    const updatedUser = await this._userRepo.update(userId, {
      ...updateData,
      ...(username && username !== user.username ? { username } : {}),
    });

    if (!updatedUser) {
      throw new BadRequestError(USER_MESSAGES.PROFILE_UPDATE_FAILED);
    }

    return updatedUser;
  }
}
