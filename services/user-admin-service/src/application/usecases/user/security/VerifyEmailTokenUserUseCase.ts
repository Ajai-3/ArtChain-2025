import {
  BadRequestError,
  ERROR_MESSAGES,
  NotFoundError,
} from "art-chain-shared";
import { VerifyEmailTokenRequestDto } from "../../../interface/dtos/user/security/VerifyEmailTokenRequestDto";
import { SafeUser } from "../../../../domain/repositories/IBaseRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IVerifyEmailTokenUserUseCase } from "../../../interface/usecases/user/security/IVerifyEmailTokenUserUseCase";
import { tokenService } from "../../../../presentation/service/token.service";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";

export class VerifyEmailTokenUserUseCase
  implements IVerifyEmailTokenUserUseCase
{
  constructor(private readonly _userRepo: IUserRepository) {}

  async execute(data: VerifyEmailTokenRequestDto): Promise<any> {
    const { userId, token } = data;

    const decoded = tokenService.verifyEmailVerificationToken(token);
    if (!decoded) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_CHANGE_EMAIL_TOKEN);
    }

    const { newEmail } = decoded as { newEmail: string };

    if (!newEmail) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_CHANGE_EMAIL_TOKEN);
    }

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const updatedUser = await this._userRepo.update(userId, {
      email: newEmail,
    });

    if (!updatedUser) {
      throw new BadRequestError(AUTH_MESSAGES.EMAIL_UPDATE_FAILED);
    }

    return updatedUser;
  }
}
