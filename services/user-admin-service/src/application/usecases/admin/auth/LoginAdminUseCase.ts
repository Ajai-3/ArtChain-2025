import bcrypt from 'bcrypt';
import { injectable, inject } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { tokenService } from '../../../../presentation/service/token.service';
import { AuthResultDto } from '../../../interface/dtos/user/auth/AuthResultDto';
import { LoginRequestDto } from '../../../interface/dtos/user/auth/LoginRequestDto';
import {
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from 'art-chain-shared';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ILoginAdminUseCase } from '../../../interface/usecases/admin/auth/ILoginAdminUseCase';

@injectable()
export class LoginAdminUseCase implements ILoginAdminUseCase {
  constructor(@inject(TYPES.IUserRepository) private _userRepo: IUserRepository) {}

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
    console.log(rawUser);
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
