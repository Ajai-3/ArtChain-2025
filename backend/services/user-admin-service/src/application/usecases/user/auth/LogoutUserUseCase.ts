import { inject, injectable } from 'inversify';
import { ILogger } from '../../../interface/ILogger';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { BadRequestError, ERROR_MESSAGES } from 'art-chain-shared';
import { IRefreshTokenVerifier } from '../../../interface/auth/IRefreshTokenVerifier';
import { ILogoutUserUseCase } from '../../../interface/usecases/user/auth/ILogoutUserUseCase';

@injectable()
export class LogoutUserUseCase implements ILogoutUserUseCase {
  constructor(
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.IRefreshTokenVerifier)
    private readonly _refreshTokenVerifier: IRefreshTokenVerifier,
  ) {}

  async execute(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new BadRequestError(ERROR_MESSAGES.MISSING_REFRESH_TOKEN);
    }
    const payload = this._refreshTokenVerifier.verify(refreshToken);

    if (typeof payload !== 'object' || payload === null) {
      throw new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    this._logger.info(
      `Logout attempt for user: ${
        payload?.username || 'unknown'
      }. Refresh token present: ${!!refreshToken}`,
    );
  }
}
