import { JwtPayload } from 'jsonwebtoken';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { ITokenGenerator } from '../../../../application/interface/auth/ITokenGenerator';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { IRefreshTokenVerifier } from '../../../../application/interface/auth/IRefreshTokenVerifier';
import { RefreshTokenResultDto } from './../../../interface/dtos/user/auth/RefreshTokenResultDto';
import { IRefreshTokenUseCase } from '../../../interface/usecases/user/auth/IRefreshTokenUseCase';
import {
  BadRequestError,
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from 'art-chain-shared';

@injectable()
export class RefreshTokenUserUseCase implements IRefreshTokenUseCase {
  constructor(
  @inject(TYPES.ITokenGenerator) private readonly _tokenGenerator: ITokenGenerator, 
  @inject(TYPES.IRefreshTokenVerifier) private readonly _refreshTokenVerifier: IRefreshTokenVerifier,
  @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository) {}

  async execute(refreshToken: string): Promise<RefreshTokenResultDto> {
    if (!refreshToken) {
      throw new BadRequestError(AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    let payload: JwtPayload | null;

    try {
      payload = this._refreshTokenVerifier.verify(refreshToken) as JwtPayload;
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

    const accessToken = this._tokenGenerator.generateAccess({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    console.log(payload, accessToken, user);

    return { accessToken };
  }
}
