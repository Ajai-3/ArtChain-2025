import { NotFoundError } from 'art-chain-shared';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../../../domain/repositories/user/ISupporterRepository';

export class GetCurrentUserUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _supporterRepo: ISupporterRepository
  ) {}

  async execute(userId: string): Promise<any> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const { supportersCount, supportingCount } = await this._supporterRepo.getUserSupportersAndSupportingCounts(userId);

    return { user, supportingCount, supportersCount };
  }
}
