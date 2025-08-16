import bcrypt from "bcrypt";
import { ConflictError, ERROR_MESSAGES } from "art-chain-shared";
import { RegisterDto } from "../../../../domain/dtos/user/RegisterDto";
import { AuthResponseDto } from "../../../../domain/dtos/user/AuthResponseDto";
import { tokenService } from "../../../../presentation/service/tocken.service";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";

export class RegisterUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: RegisterDto): Promise<AuthResponseDto> {
    const { name, username, email, password } = data;

    const existingUserByUsername = await this.userRepo.findByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictError(AUTH_MESSAGES.DUPLICATE_USERNAME);
    }

    const existingUserByEmail = await this.userRepo.findByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictError(AUTH_MESSAGES.DUPLICATE_EMAIL);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userRepo.create({
      id: null,
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

    const refreshToken = tokenService.generateRefreshToken(payload);
    const accessToken = tokenService.generateAccessToken(payload);

    return { user, accessToken, refreshToken };
  }
}
