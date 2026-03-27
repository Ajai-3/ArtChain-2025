import bcrypt from 'bcrypt';
import { inject, injectable } from 'inversify';
import { BadRequestError, ConflictError } from 'art-chain-shared';
import { mapCdnUrl } from '../../../../utils/mapCdnUrl';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { AuthResultDto } from '../../../interface/dtos/user/auth/AuthResultDto';
import { ITokenGenerator } from '../../../../application/interface/auth/ITokenGenerator';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { RegisterRequestDto } from '../../../interface/dtos/user/auth/RegisterRequestDto';
import { IRegisterUserUseCase } from '../../../interface/usecases/user/auth/IRegisterUserUseCase';
import { IEventBus } from '../../../interface/events/IEventBus';
import { UserCreatedEvent } from '../../../../domain/events/UserCreatedEvent';
import { IEmailTokenVerifier } from '../../../interface/auth/IEmailTokenVerifier';

@injectable()
export class RegisterUserUseCase implements IRegisterUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.IEmailTokenVerifier)
    private readonly _emailTokenVerifier: IEmailTokenVerifier,
    @inject(TYPES.ITokenGenerator)
    private readonly _tokenGenerator: ITokenGenerator,
    @inject(TYPES.IEventBus) private readonly _eventBus: IEventBus,
  ) {}

  async execute(data: RegisterRequestDto): Promise<AuthResultDto> {
    const { token, password } = data;
    let decodedPayload: any;

    if (!token) {
      throw new BadRequestError(AUTH_MESSAGES.TOKEN_REQUIRED);
    }

    try {
      decodedPayload = this._emailTokenVerifier.verifyEmail(token);
    } catch (err) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_EMAIL_TOKEN);
    }

    const { name, email, username } = decodedPayload;

    if (!name || !email || !username) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_TOKEN);
    }

    const existingUserByUsername =
      await this._userRepo.findByUsername(username);
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
      phone: '',
      password: hashedPassword,
      isVerified: false,
      profileImage: '',
      bannerImage: '',
      backgroundImage: '',
      bio: '',
      country: '',
      role: 'user',
      plan: 'free',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const formattedUser = {
      ...user,
      profileImage: mapCdnUrl(user.profileImage) || '',
      bannerImage: mapCdnUrl(user.bannerImage) || '',
      backgroundImage: mapCdnUrl(user.backgroundImage) || '',
    };

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const refreshToken = this._tokenGenerator.generateRefresh(payload);
    const accessToken = this._tokenGenerator.generateAccess(payload);

    await this._eventBus.publish(new UserCreatedEvent(user));

    return { user: formattedUser, accessToken, refreshToken };
  }
}
