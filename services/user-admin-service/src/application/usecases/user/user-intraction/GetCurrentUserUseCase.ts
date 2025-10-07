import { inject, injectable } from 'inversify';
import { NotFoundError } from 'art-chain-shared';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../../../domain/repositories/user/ISupporterRepository';
import { IGetCurrentUserUseCase } from '../../../interface/usecases/user/user-intraction/IGetCurrentUserUseCase';
import { GetCurrentUserResultDto } from '../../../interface/dtos/user/user-intraction/GetCurrentUserResultDto';

@injectable()
export class GetCurrentUserUseCase implements IGetCurrentUserUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(userId: string): Promise<GetCurrentUserResultDto> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const { supportersCount, supportingCount } =
      await this._supporterRepo.getUserSupportersAndSupportingCounts(userId);

    return { user, supportingCount, supportersCount };
  }
}
