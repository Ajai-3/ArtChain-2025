import { inject, injectable } from 'inversify';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../../../domain/repositories/user/ISupporterRepository';
import { IUnSupportUserUseCase } from '../../../interface/usecases/user/user-intraction/IUnSupportUserUseCase';
import { SupportUnSupportRequestDto } from '../../../interface/dtos/user/user-intraction/SupportUnSupportRequestDto';

@injectable()
export class UnSupportUserUseCase implements IUnSupportUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(data: SupportUnSupportRequestDto): Promise<void> {
    const { userId, currentUserId } = data;

    if (!userId || !currentUserId) {
      throw new BadRequestError(USER_MESSAGES.INVALID_SUPPORT_REQUEST);
    }

    const supporter = await this._userRepo.findById(currentUserId);
    if (!supporter) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }
    const targetUser = await this._userRepo.findById(userId);
    if (!targetUser) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const isSupporting = await this._supporterRepo.isSupporting(
      supporter.id,
      targetUser.id
    );
    if (!isSupporting) {
      throw new BadRequestError(USER_MESSAGES.NOT_SUPPORTING);
    }

    await this._supporterRepo.removeSupport(supporter.id, targetUser.id);
  }
}
