import { injectable, inject } from 'inversify';
import { ConflictError } from 'art-chain-shared';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { tokenService } from '../../../../presentation/service/token.service';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { StartRegisterRequestDto } from '../../../interface/dtos/user/auth/StartRegisterRequestDto';
import { IStartRegisterUserUseCase } from '../../../interface/usecases/user/auth/IStartRegisterUserUseCase';
import { StartRegisterResultDto } from '../../../interface/dtos/user/auth/StartRegisterResultDto';

@injectable()
export class StartRegisterUserUseCase implements IStartRegisterUserUseCase {
  constructor(@inject(TYPES.IUserRepository) private _userRepo: IUserRepository) {}

  async execute(data: StartRegisterRequestDto): Promise<StartRegisterResultDto> {
    const { name, username, email } = data;

    const existingUser = await this._userRepo.findByEmail(email);

    if (existingUser) {
      throw new ConflictError(AUTH_MESSAGES.DUPLICATE_EMAIL);
    }

    const existingUserByUsername = await this._userRepo.findByUsername(username);

    if (existingUserByUsername) {
      throw new ConflictError(AUTH_MESSAGES.DUPLICATE_USERNAME);
    }

    const payload = {
      name,
      username,
      email,
    };

    const token = tokenService.generateEmailVerificationToken(payload);

    return { token, payload };
  }
}
