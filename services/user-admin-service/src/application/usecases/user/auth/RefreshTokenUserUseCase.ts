import { tokenService } from "../../../../presentation/service/tocken.service";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import {
  BadRequestError,
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from "art-chain-shared";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";

export class RefreshTokenUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(refreshToken: string): Promise<any> {
    if (!refreshToken) {
      throw new BadRequestError(AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    const payload = tokenService.verifyRefreshToken(refreshToken);

    if (!payload) {
      throw new BadRequestError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (typeof payload !== "object" || payload === null) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const user = await this.userRepo.findByEmail(payload?.email);

    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (
      (user.role === "user" || user.role === "artist") &&
      user.status === "banned"
    ) {
      throw new ForbiddenError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const accessToken = tokenService.generateAccessToken(payload);

    return accessToken;
  }
}
