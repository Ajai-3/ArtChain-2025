import bcrypt from "bcrypt";
import { inject, injectable } from "inversify";
import { ConflictError } from "art-chain-shared";
import { mapCdnUrl } from "../../../../utils/mapCdnUrl";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { tokenService } from "../../../../presentation/service/token.service";
import { AuthResultDto } from "../../../interface/dtos/user/auth/AuthResultDto";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { RegisterRequestDto } from "../../../interface/dtos/user/auth/RegisterRequestDto";
import { IRegisterUserUseCase } from "../../../interface/usecases/user/auth/IRegisterUserUseCase";

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository
  ) {}

  async execute(data: RegisterRequestDto): Promise<AuthResultDto> {
    const { name, username, email, password } = data;

    const existingUserByUsername = await this._userRepo.findByUsername(
      username
    );
    if (existingUserByUsername) {
      throw new ConflictError(AUTH_MESSAGES.DUPLICATE_USERNAME);
    }

    const existingUserByEmail = await this._userRepo.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictError(AUTH_MESSAGES.DUPLICATE_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this._userRepo.create({
      name,
      email,
      username,
      phone: "",
      password: hashedPassword,
      isVerified: false,
      profileImage: "",
      bannerImage: "",
      backgroundImage: "",
      bio: "",
      country: "",
      role: "user",
      plan: "free",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const formattedUser = {
      ...user,
      profileImage: mapCdnUrl(user.profileImage) || "",
      bannerImage: mapCdnUrl(user.bannerImage) || "",
      backgroundImage: mapCdnUrl(user.backgroundImage) || "",
    };

    const refreshToken = tokenService.generateRefreshToken(payload);
    const accessToken = tokenService.generateAccessToken(payload);

    return { user: formattedUser, accessToken, refreshToken };
  }
}
