import { injectable, inject } from "inversify";
import { mapCdnUrl } from "../../../../utils/mapCdnUrl";
import { IEventBus } from "../../../interface/events/IEventBus";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { BadRequestError, ForbiddenError } from "art-chain-shared";
import { ITokenGenerator } from "../../../interface/auth/ITokenGenerator";
import { AuthResultDto } from "../../../interface/dtos/user/auth/AuthResultDto";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { UserCreatedEvent } from "../../../../domain/events/UserCreatedEvent";
import { GoogleAuthRequestDto } from "../../../interface/dtos/user/auth/GoogleAuthRequestDto";
import { IGoogleAuthUserUseCase } from "../../../interface/usecases/user/auth/IGoogleAuthUserUseCase";
import { IGoogleTokenVerifier } from "../../../interface/auth/IGoogleTokenVerifier";

@injectable()
export class GoogleAuthUserUseCase implements IGoogleAuthUserUseCase {
  constructor(
    @inject(TYPES.IEventBus) private readonly _eventBus: IEventBus,
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.ITokenGenerator) private readonly _tokenGenerator: ITokenGenerator,
    @inject(TYPES.IGoogleTokenVerifier)
    private readonly _googleTokenVerifier: IGoogleTokenVerifier
  ) {}

  async execute(data: GoogleAuthRequestDto): Promise<AuthResultDto> {
    const { token, email, name } = data;
    let isNewUser = false;

    const decodedToken = await this._googleTokenVerifier.verify(token);
    if (!decodedToken) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_VERIFICATION_TOKEN);
    }

    let normalizedUsername = name.trim().toLowerCase().replace(/\s+/g, "_");
    const usernameExists = await this._userRepo.findByUsername(
      normalizedUsername
    );
    if (usernameExists) {
      normalizedUsername += Math.floor(Math.random() * 1000).toString();
    }

    const existingUser = await this._userRepo.findByEmail(email);

    if (!existingUser) {
      const newUser = await this._userRepo.create({
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

      const payload = {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      };

      const refreshToken = this._tokenGenerator.generateRefresh(payload);
      const accessToken = this._tokenGenerator.generateAccess(payload);

      return { user: newUser, isNewUser: true, accessToken, refreshToken };
    }

    if (!["user", "artist"].includes(existingUser.role)) {
      throw new ForbiddenError(AUTH_MESSAGES.INVALID_USER_ROLE);
    }

    if (existingUser.status === "banned") {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_BANNED);
    }

    if (existingUser.status === "deleted") {
      throw new ForbiddenError(AUTH_MESSAGES.ACCOUNT_DELETED);
    }

    const payload = {
      id: existingUser.id,
      email: existingUser.email,
      role: existingUser.role,
    };

    const formattedUser = {
      ...existingUser,
      profileImage: mapCdnUrl(existingUser.profileImage) || "",
      bannerImage: mapCdnUrl(existingUser.bannerImage) || "",
      backgroundImage: mapCdnUrl(existingUser.backgroundImage) || "",
    };

    if (isNewUser) {
          await this._eventBus.publish(new UserCreatedEvent(formattedUser));
    }

    const refreshToken = this._tokenGenerator.generateRefresh(payload);
    const accessToken = this._tokenGenerator.generateAccess(payload);

    return { user: formattedUser, isNewUser: false, accessToken, refreshToken };
  }
}
