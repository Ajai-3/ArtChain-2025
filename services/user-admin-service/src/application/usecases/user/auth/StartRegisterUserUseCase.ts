import { ConflictError } from 'art-chain-shared';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { tokenService } from '../../../../presentation/service/token.service';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { StartRegisterRequestDto } from '../../../../domain/dtos/user/auth/StartRegisterRequestDto';
import { IStartRegisterUserUseCase } from '../../../../domain/usecases/user/auth/IStartRegisterUserUseCase';
import { StartRegisterResultDto } from '../../../../domain/dtos/user/auth/StartRegisterResultDto';

export class StartRegisterUserUseCase implements IStartRegisterUserUseCase {
  constructor(private _userRepo: IUserRepository) {}

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
