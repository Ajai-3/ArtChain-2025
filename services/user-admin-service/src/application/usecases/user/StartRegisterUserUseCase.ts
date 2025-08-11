import { ConflictError, ERROR_MESSAGES } from 'art-chain-shared';
import { StartRegisterDto } from '../../../domain/dtos/user/StartRegisterDto';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { tokenService } from '../../../presentation/service/tocken.service';


export class StartRegisterUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: StartRegisterDto) {
    const { name, username, email } = data;

    const existingUser = await this.userRepo.findByEmail(email);

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.DUPLICATE_EMAIL);

    }

    const existingUserByUsername = await this.userRepo.findByUsername(username);

    if (existingUserByUsername) {
      throw new ConflictError(ERROR_MESSAGES.DUPLICATE_USERNAME);
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