import bcrypt from "bcrypt";
import { LoginRequestDto } from "../../../../domain/dtos/user/LoginRequestDto";
import { AuthResponseDto } from "../../../../domain/dtos/user/AuthResponseDto";
import { tokenService } from "../../../../presentation/service/tocken.service";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import {
  ERROR_MESSAGES,
  ForbiddenError,
  UnauthorizedError,
} from "art-chain-shared";

export class LoginUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: LoginRequestDto): Promise<AuthResponseDto> {
    const { identifier, password } = data;

    const rawUser =
      (await this.userRepo.findByUsernameRaw(identifier)) ||
      (await this.userRepo.findByEmailRaw(identifier));

    if (!rawUser) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (rawUser.role !== "user" && rawUser.role !== "artist") {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (rawUser.status !== "active") {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }
    const isValid = bcrypt.compareSync(password, rawUser.password);
    if (!isValid) {
      throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const user =
      (await this.userRepo.findByUsername(identifier)) ||
      (await this.userRepo.findByEmail(identifier));

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
