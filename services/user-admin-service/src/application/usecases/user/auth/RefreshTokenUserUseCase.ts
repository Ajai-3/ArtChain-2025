import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { tokenService } from "../../../../presentation/service/tocken.service";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import {
  BadRequestError,
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from "art-chain-shared";

export class RefreshTokenUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(refreshToken: string): Promise<string> {
    if (!refreshToken) {
      throw new BadRequestError(AUTH_MESSAGES.REFRESH_TOKEN_REQUIRED);
    }

    let payload: any;
    try {
      payload = tokenService.verifyRefreshToken(refreshToken);
    } catch (err) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    if (!payload || typeof payload !== "object" || !payload.email) {
      throw new UnauthorizedError(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const user = await this.userRepo.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (user.status === "banned") {
      throw new ForbiddenError("Your account has been banned.");
    }

    const accessToken = tokenService.generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return accessToken;
  }
}
