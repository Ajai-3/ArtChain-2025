import bcrypt from 'bcrypt';
import { injectable, inject } from 'inversify';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { IEmailTokenVerifier } from '../../../interface/auth/IEmailTokenVerifier';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ResetPasswordRequestDto} from '../../../interface/dtos/user/auth/ResetPasswordRequestDto';
import { IResetPasswordUserUseCase } from '../../../interface/usecases/user/auth/IResetPasswordUserUseCase';

@injectable()
export class ResetPasswordUserUseCase implements IResetPasswordUserUseCase {
  constructor(@inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository, 
  @inject(TYPES.IEmailTokenVerifier) private readonly _emailTokenVerifier: IEmailTokenVerifier,
  ) {}

  async execute(data: ResetPasswordRequestDto): Promise<void> {
    const { token, password } = data;

    const decoded = this._emailTokenVerifier.verify(token);
    if (!decoded) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_RESET_TOKEN);
    }

    if (!decoded.email) {
      throw new BadRequestError(AUTH_MESSAGES.INVALID_RESET_TOKEN);
    }

    const user = await this._userRepo.findByEmailRaw(decoded.email);
    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const isSamePassword = bcrypt.compareSync(password, user.password);
    if (isSamePassword) {
      throw new BadRequestError(AUTH_MESSAGES.NEW_PASSWORD_IS_SAME_AS_CURRENT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this._userRepo.update(user.id, { password: hashedPassword });
  }
}
