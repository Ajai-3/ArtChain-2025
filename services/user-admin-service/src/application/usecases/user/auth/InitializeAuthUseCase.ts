import { JwtPayload } from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { tokenService } from '../../../../presentation/service/token.service';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { InitializeAuthResultDto } from '../../../interface/dtos/user/auth/InitializeAuthResultDto';
import { IInitializeAuthUseCase } from '../../../interface/usecases/user/auth/InitializeAuthUseCase';
import { mapCdnUrl } from '../../../../utils/mapCdnUrl';
import {
  BadRequestError,
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from 'art-chain-shared';

@injectable()
export class InitializeAuthUseCase implements IInitializeAuthUseCase {
  constructor(@inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository) {}

  async execute(refreshToken: string): Promise<InitializeAuthResultDto> {
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

    const email = payload.email as string;
    const user = await this._userRepo.findByEmail(email);
    
    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status === 'banned') {
      throw new ForbiddenError(AUTH_MESSAGES.USER_BANNED);
    }

    const accessToken = tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const userWithCdn = { ...user };
    if (userWithCdn.profileImage) {
        userWithCdn.profileImage = mapCdnUrl(userWithCdn.profileImage) ?? null;
    }

    return { accessToken, user: userWithCdn };
  }
}
