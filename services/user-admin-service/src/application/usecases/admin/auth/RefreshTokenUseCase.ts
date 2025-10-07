import { JwtPayload } from 'jsonwebtoken';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { tokenService } from '../../../../presentation/service/token.service';
import {
  BadRequestError,
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from 'art-chain-shared';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { RefreshTokenResultDto } from '../../../interface/dtos/user/auth/RefreshTokenResultDto';
import { IRefreshTokenUseCase } from '../../../interface/usecases/user/auth/IRefreshTokenUseCase';

export class RefreshTokenUseCase implements IRefreshTokenUseCase {
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

    const admin = await this._userRepo.findByEmail(payload.email as string);
    if (!admin) {
      throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (admin.role !== 'admin') {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    const accessToken = tokenService.generateAccessToken({
      id: admin.id,
      email: admin.email,
      role: admin.role,
    });

    console.log(payload, accessToken, admin);

    return { accessToken };
  }
}
