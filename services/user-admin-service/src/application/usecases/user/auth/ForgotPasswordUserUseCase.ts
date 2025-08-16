import { BadRequestError } from "art-chain-shared";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { tokenService } from "../../../../presentation/service/tocken.service";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";

export class ForgotPasswordUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(identifier: string): Promise<any> {
    const normalizedInput = identifier.toLocaleLowerCase();

    let user = await this.userRepo.findByUsername(normalizedInput);

    if (!user) {
      user = await this.userRepo.findByEmail(identifier);
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
