import { BadRequestError } from 'art-chain-shared';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { tokenService } from '../../../../presentation/service/token.service';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ForgotPasswordResultDto } from '../../../interface/dtos/user/auth/ForgotPasswordResultDto';
import { IForgotPasswordUserUseCase } from '../../../interface/usecases/user/auth/IForgotPasswordUserUseCase';

export class ForgotPasswordUserUseCase implements IForgotPasswordUserUseCase {
  constructor(private _userRepo: IUserRepository) {}

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

    const token = tokenService.generateEmailVerificationToken({
      name: user.name,
      username: user.username,
      email: user.email,
    });

    return { user, token };
  }
}
