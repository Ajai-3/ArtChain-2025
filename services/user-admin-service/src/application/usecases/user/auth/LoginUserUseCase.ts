import bcrypt from "bcrypt";
import { LoginRequestDto } from "../../../../domain/dtos/user/LoginRequestDto";
import { AuthResponseDto } from "../../../../domain/dtos/user/AuthResponseDto";
import { tokenService } from "../../../../presentation/service/token.service";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import {
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from "art-chain-shared";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";

export class LoginUserUseCase {
  constructor(private _userRepo: IUserRepository) {}

  async execute(data: LoginRequestDto): Promise<AuthResponseDto> {
    const { identifier, password } = data;

    const rawUser =
      (await this._userRepo.findByUsernameRaw(identifier)) ||
      (await this._userRepo.findByEmailRaw(identifier));

    if (!rawUser) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    if (rawUser.role !== "user" && rawUser.role !== "artist") {
      throw new ForbiddenError(AUTH_MESSAGES.INVALID_USER_ROLE);
    }

    if (rawUser.status !== "active" && rawUser.status !== "suspended") {
      throw new ForbiddenError(AUTH_MESSAGES.LOGIN_NOT_ALLOWED);
    }

    const isValid = bcrypt.compareSync(password, rawUser.password);
    if (!isValid) {
      throw new UnauthorizedError(AUTH_MESSAGES.INVALID_CREDENTIALS);
    }

    const user =
      (await this._userRepo.findByUsername(identifier)) ||
      (await this._userRepo.findByEmail(identifier));

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
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
