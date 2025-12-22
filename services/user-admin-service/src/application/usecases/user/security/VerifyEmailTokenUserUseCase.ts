import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { IEmailTokenVerifier } from '../../../interface/auth/IEmailTokenVerifier';
import { VerifyEmailTokenRequestDto } from '../../../interface/dtos/user/security/VerifyEmailTokenRequestDto';
import { IVerifyEmailTokenUserUseCase } from '../../../interface/usecases/user/security/IVerifyEmailTokenUserUseCase';
import {
  BadRequestError,
  ERROR_MESSAGES,
  NotFoundError,
} from 'art-chain-shared';

@injectable()
export class VerifyEmailTokenUserUseCase
  implements IVerifyEmailTokenUserUseCase
{
  constructor(
    @inject(TYPES.IEmailTokenVerifier) private readonly _emailTokenVerifier: IEmailTokenVerifier,
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository
  ) {}

  async execute(data: VerifyEmailTokenRequestDto): Promise<any> {
    const { userId, token } = data;

    const decoded = this._emailTokenVerifier.verify(token);
    if (!decoded) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_CHANGE_EMAIL_TOKEN);
    }

    const { newEmail } = decoded as { newEmail: string };

    if (!newEmail) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_CHANGE_EMAIL_TOKEN);
    }

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const updatedUser = await this._userRepo.update(userId, {
      email: newEmail,
    });

    if (!updatedUser) {
      throw new BadRequestError(AUTH_MESSAGES.EMAIL_UPDATE_FAILED);
    }

    return updatedUser;
  }
}
