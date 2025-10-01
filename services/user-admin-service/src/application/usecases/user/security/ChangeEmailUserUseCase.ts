import { ConflictError, ERROR_MESSAGES, NotFoundError } from "art-chain-shared";
import { ChangeEmailDto } from "../../../interface/dtos/user/security/ChangeEmailDto";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IChangeEmailUserUseCase } from "../../../interface/usecases/user/security/IChangeEmailUserUseCase";
import { USER_MESSAGES } from "../../../../constants/userMessages";
import { tokenService } from "../../../../presentation/service/token.service";

export class ChangeEmailUserUseCase implements IChangeEmailUserUseCase {
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(data: ChangeEmailDto): Promise<any> {
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

    return { user, token }
  }
}
