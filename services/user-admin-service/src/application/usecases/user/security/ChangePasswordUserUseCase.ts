import bcrypt from "bcrypt";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ChangePasswordRequestDto } from "../../../interface/dtos/user/security/ChangePasswordRequestDto";
import { IChangePasswordUserUseCase } from "../../../interface/usecases/user/security/IChangePasswordUserUseCase";
import {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} from "art-chain-shared";

export class ChangePasswordUserUseCase implements IChangePasswordUserUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(data: ChangePasswordRequestDto): Promise<void> {
    const { userId, currentPassword, newPassword } = data;

    const rawUser = await this._userRepo.findByIdRaw(userId);
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

    await this._userRepo.update(userId, { password: hashedPassword });
  }
}
