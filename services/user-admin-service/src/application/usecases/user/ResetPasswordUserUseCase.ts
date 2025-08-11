import bcrypt from 'bcrypt';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { ResetPasswordDto } from '../../../domain/dtos/user/ResetPasswordDto';
import { tokenService } from '../../../presentation/service/tocken.service';
import { AUTH_MESSAGES } from '../../../constants/authMessages';
import {
  BadRequestError,
  ERROR_MESSAGES,
  NotFoundError,
} from 'art-chain-shared';

export class ResetPasswordUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: ResetPasswordDto) {
    const { token, password } = data;

    const decoded = await tokenService.verifyEmailVerificationToken(token);
    if (!decoded) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_RESET_TOKEN);
    }

    if (!decoded.email) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_RESET_TOKEN);
    }

    const user = await this.userRepo.findByEmailRaw(decoded.email);
    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const isSamePassword = bcrypt.compareSync(password, user.password);
    if (isSamePassword) {
      throw new BadRequestError(ERROR_MESSAGES.NEW_PASSWORD_IS_SAME_AS_CURRENT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.userRepo.update(user.id, { password: hashedPassword });
  }
}
