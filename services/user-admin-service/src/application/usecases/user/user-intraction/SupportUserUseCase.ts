import { inject, injectable } from 'inversify';
import { ILogger } from '../../../interface/ILogger';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../../../domain/repositories/user/ISupporterRepository';
import { ISupportUserUseCase } from '../../../interface/usecases/user/user-intraction/ISupportUserUseCase';
import { IEventBus } from '../../../interface/events/IEventBus';
import { UserSupportedEvent } from '../../../../domain/events/UserSupportedEvent';
import { SupportUnSupportRequestDto } from '../../../interface/dtos/user/user-intraction/SupportUnSupportRequestDto';

@injectable()
export class SupportUserUseCase implements ISupportUserUseCase {
  constructor(
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository,
    @inject(TYPES.IEventBus)
    private readonly _eventBus: IEventBus
  ) {}

  async execute(data: SupportUnSupportRequestDto): Promise<void> {
    const { userId, currentUserId } = data;

    if (!userId || !currentUserId) {
      throw new BadRequestError(USER_MESSAGES.INVALID_SUPPORT_REQUEST);
    }

    if (currentUserId === userId) {
      throw new BadRequestError(USER_MESSAGES.CANNOT_SUPPORT_YOURSELF);
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
    if (isSupporting) {
      throw new BadRequestError(USER_MESSAGES.ALREADY_SUPPORTING);
    }

    await this._supporterRepo.addSupport(supporter.id, targetUser.id);

    await this._eventBus.publish(new UserSupportedEvent(
      targetUser.id,
      supporter.id,
      supporter.username,
      supporter.profileImage || ''
    ));

    this._logger.info(`User ${supporter.username} supported ${targetUser.username}`);
  }
}
