import { inject, injectable } from "inversify";
import { ILogger } from "../../../interface/ILogger";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { ILogoutUserUseCase } from "../../../interface/usecases/user/auth/ILogoutUserUseCase";
import { IRefreshTokenVerifier } from "../../../interface/auth/IRefreshTokenVerifier";
import { BadRequestError } from "art-chain-shared";

@injectable()
export class LogoutUserUseCase implements ILogoutUserUseCase {
  constructor(@inject(TYPES.ILogger) private readonly _logger: ILogger,
    @inject(TYPES.IRefreshTokenVerifier) private readonly _refreshTokenVerifier: IRefreshTokenVerifier) {}

  async execute(refreshToken: string): Promise<void> {
    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }
    const payload = this._refreshTokenVerifier.verify(refreshToken);

    if (typeof payload !== "object" || payload === null) {
      throw new BadRequestError("Invalid refresh token");
    }

    this._logger.info(
      `Logout attempt for user: ${
        payload?.username || 'unknown'
      }. Refresh token present: ${!!refreshToken}`
    );
  }
}