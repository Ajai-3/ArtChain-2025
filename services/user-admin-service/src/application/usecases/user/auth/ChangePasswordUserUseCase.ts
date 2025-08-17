import bcrypt from "bcrypt";
import { ChangePasswordDto } from "../../../../domain/dtos/user/ChangePasswordDto";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import {
  BadRequestError,
  ERROR_MESSAGES,
  NotFoundError,
  UnauthorizedError,
} from "art-chain-shared";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";

export class ChangePasswordUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: ChangePasswordDto) {
    const { userId, currentPassword, newPassword } = data;

    const rawUser = await this.userRepo.findByIdRaw(userId);
    if (!rawUser) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const isValid = bcrypt.compareSync(currentPassword, rawUser.password);
    if (!isValid) {
      throw new UnauthorizedError(AUTH_MESSAGES.INCORRECT_CURRENT_PASSWORD);
    }

    const isSamePassword = bcrypt.compareSync(newPassword, rawUser.password);
    if (isSamePassword) {
      throw new BadRequestError(AUTH_MESSAGES.NEW_PASSWORD_IS_SAME_AS_CURRENT);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepo.update(userId, { password: hashedPassword });
  }
}
