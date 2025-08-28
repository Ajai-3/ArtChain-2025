import bcrypt from 'bcrypt';

import { tokenService } from '../../../presentation/service/token.service';
import { AuthResultDto } from '../../../domain/dtos/user/auth/AuthResultDto';
import { LoginRequestDto } from '../../../domain/dtos/user/auth/LoginRequestDto';
import { IUserRepository } from '../../../domain/repositories/user/IUserRepository';
import { ERROR_MESSAGES, ForbiddenError, UnauthorizedError } from 'art-chain-shared';
import { ILoginAdminUseCase } from '../../../domain/usecases/admin/auth/ILoginAdminUseCase';

export class LoginAdminUseCase implements ILoginAdminUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(data: LoginRequestDto): Promise<AuthResultDto> {
    const { identifier, password } = data;

    const rawUser =
      (await this._userRepo.findByUsernameRaw(identifier)) ||
      (await this._userRepo.findByEmailRaw(identifier));

    if (!rawUser) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (rawUser.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (rawUser.status !== 'active') {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    const isValid = bcrypt.compareSync(password, rawUser.password);
    if (!isValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const user =
      (await this._userRepo.findByUsername(identifier)) ||
      (await this._userRepo.findByEmail(identifier));

    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshToken = tokenService.generateRefreshToken(payload);
    const accessToken = tokenService.generateAccessToken(payload);

    return { user, accessToken, refreshToken };
  }
}
