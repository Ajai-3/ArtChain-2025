import { inject, injectable } from 'inversify';
import { IEventBus } from '../../../interface/events/IEventBus';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { tokenService } from '../../../../presentation/service/token.service';
import { ConflictError, ERROR_MESSAGES, NotFoundError } from 'art-chain-shared';
import { ChangeEmailDto } from '../../../interface/dtos/user/security/ChangeEmailDto';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { IChangeEmailUserUseCase } from '../../../interface/usecases/user/security/IChangeEmailUserUseCase';
import { EmailChangeVerificationEvent } from '../../../../domain/events/EmailChangeVerificationEvent';

@injectable()
export class ChangeEmailUserUseCase implements IChangeEmailUserUseCase {
  constructor(
    @inject(TYPES.IEventBus)
    private readonly _eventBus: IEventBus,
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
  ) {}

  async execute(data: ChangeEmailDto): Promise<string> {
    const { userId, newEmail } = data;

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const existingEmail = await this._userRepo.findByEmail(newEmail);

    if (existingEmail) {
      throw new ConflictError(ERROR_MESSAGES.DUPLICATE_EMAIL);
    }

    const token = tokenService.generateEmailVerificationToken({
      name: user.name,
      username: user.username,
      newEmail: newEmail,
      email: user.email,
    });

    await this._eventBus.publish(new EmailChangeVerificationEvent(
      user.email,
      user.name,
      token
    ));

    return token;
  }
}
