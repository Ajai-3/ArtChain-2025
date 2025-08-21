import { ConflictError } from 'art-chain-shared';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { tokenService } from '../../../../presentation/service/token.service';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { StartRegisterRequestDto } from '../../../../domain/dtos/user/auth/StartRegisterRequestDto';

export class StartRegisterUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: StartRegisterRequestDto) {
    const { name, username, email } = data;

    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) {
      throw new ConflictError(AUTH_MESSAGES.DUPLICATE_EMAIL);
    }

    const existingUserByUsername = await this.userRepo.findByUsername(username);

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
