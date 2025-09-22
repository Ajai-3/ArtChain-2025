import { JwtPayload } from 'jsonwebtoken';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { tokenService } from '../../../../presentation/service/token.service';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { RefreshTokenResultDto } from './../../../../domain/dtos/user/auth/RefreshTokenResultDto';
import { IRefreshTokenUseCase } from '../../../../domain/usecases/user/auth/IRefreshTokenUseCase';
import {
  BadRequestError,
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from 'art-chain-shared';

export class RefreshTokenUserUseCase implements IRefreshTokenUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(refreshToken: string): Promise<RefreshTokenResultDto> {
    if (!refreshToken) {
      throw new BadRequestError(AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    let payload: JwtPayload | null;

    try {
      payload = tokenService.verifyRefreshToken(refreshToken) as JwtPayload;
    } catch (err) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_REFRESH_TOKEN);
    }

    if (!payload || typeof payload !== 'object' || !('email' in payload)) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const user = await this._userRepo.findByEmail(payload.email as string);
    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status === 'banned') {
      throw new ForbiddenError('Your account has been banned.');
    }

    const accessToken = tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    console.log(payload, accessToken, user);

    return { accessToken };
  }
}
