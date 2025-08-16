import bcrypt from "bcrypt";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import admin from "../../../../infrastructure/config/firebase-admin";
import { GoogleAuthDto } from "../../../../domain/dtos/user/GoogleAuthDto";
import { tokenService } from "../../../../presentation/service/tocken.service";
import { IUserRepository } from "../../../../domain/repositories/IUserRepository";
import {
  BadRequestError,
  ERROR_MESSAGES,
  ForbiddenError,
} from "art-chain-shared";

export class GoogleAuthUserUseCase {
  constructor(private userRepo: IUserRepository) {}

  async execute(data: GoogleAuthDto): Promise<any> {
    const { token, email, name } = data;

    const decodedToken = await admin.auth().verifyIdToken(token);
    if (!decodedToken) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN);
    }

    let normalizedUsername = name.trim().toLowerCase().replace(/\s+/g, "_");

    const user = await this.userRepo.findByEmail(email);
    const existUserName = await this.userRepo.findByUsername(
      normalizedUsername
    );

    if (existUserName) {
      normalizedUsername += Math.floor(Math.random() * 1000).toString();
      console.log(normalizedUsername);
    }

    let newUser;
    let payload;
    let isNewUser = false;
    let refreshToken;
    let accessToken;

    if (!user) {
      newUser = await this.userRepo.create({
        id: null,
        name,
        email,
        username: normalizedUsername,
        phone: "",
        password: "",
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

      let user = await this.userRepo.findByEmail(email);

      payload = {
        id: user?.id,
        email: user?.email,
        role: user?.role,
      };

      refreshToken = tokenService.generateRefreshToken(payload);
      accessToken = tokenService.generateAccessToken(payload);
      return { user: newUser, isNewUser: true, accessToken, refreshToken };
    }

    if (user.role !== "user" && user.role !== "artist") {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    if (user.status !== "active") {
      throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
    }

    payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    refreshToken = tokenService.generateRefreshToken(payload);
    accessToken = tokenService.generateAccessToken(payload);

    return { user, isNewUser, accessToken, refreshToken };
  }
}
