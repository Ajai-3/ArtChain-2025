import { ERROR_MESSAGES, UnauthorizedError } from 'art-chain-shared';
import { tokenService } from '../../../presentation/service/tocken.service';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';


export class ForgotPasswordUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(identifier: string): Promise<any> {
    const normalizedInput = identifier.toLocaleLowerCase();

    let user = await this.userRepo.findByUsername(normalizedInput);

    if (!user) {
      user = await this.userRepo.findByEmail(identifier);
    }

    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = await tokenService.generateEmailVerificationToken({
      name: user.name,
      username: user.username,
      email: user.email,
    });

    return { user, token };
  }
}