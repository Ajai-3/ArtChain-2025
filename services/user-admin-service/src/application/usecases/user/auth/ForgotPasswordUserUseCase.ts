import { injectable, inject } from 'inversify';
import { BadRequestError } from 'art-chain-shared';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { ITokenGenerator } from '../../../interface/auth/ITokenGenerator';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { IForgotPasswordUserUseCase } from '../../../interface/usecases/user/auth/IForgotPasswordUserUseCase';
import { IEventBus } from '../../../interface/events/IEventBus';
import { PasswordResetRequestedEvent } from '../../../../domain/events/PasswordResetRequestedEvent';
import { ForgotPasswordResultDto } from '../../../interface/dtos/user/auth/ForgotPasswordResultDto';
import { config } from '../../../../infrastructure/config/env';

@injectable()
export class ForgotPasswordUserUseCase implements IForgotPasswordUserUseCase {
  constructor(
    @inject(TYPES.ITokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.IEventBus)
    private readonly _eventBus: IEventBus
  ) {}

  async execute(identifier: string): Promise<ForgotPasswordResultDto> {
    const normalizedInput = identifier.toLocaleLowerCase();

    let user = await this._userRepo.findByUsername(normalizedInput);

    if (!user) {
      user = await this._userRepo.findByEmail(identifier);
    }

    if (!user) {
      throw new BadRequestError(
        AUTH_MESSAGES.INVALID_FORGOT_PASSWORD_IDENTIFIER
      );
    }

    const token = this._tokenGenerator.generateEmailVerification({
      name: user.name,
      username: user.username,
      email: user.email,
    });

    await this._eventBus.publish(new PasswordResetRequestedEvent(
      user.email,
      user.name,
      token,
      `${config.frontend_URL}/reset-password?token=${token}`
    ));

    return { user, token };
  }
}
