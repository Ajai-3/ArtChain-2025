import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { AUTH_MESSAGES } from '../../../../constants/authMessages';
import { USER_MESSAGES } from './../../../../constants/userMessages';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../../../domain/repositories/user/ISupporterRepository';
import { IGetUserWithIdUserUseCase } from '../../../../domain/usecases/user/user-intraction/IGetUserWithIdUserUseCase';
import { GetUserProfileWithIdResultDto } from '../../../../domain/dtos/user/user-intraction/GetUserProfileWithIdResultDto';
import { GetUserProfileWithIdRequestDto } from '../../../../domain/dtos/user/user-intraction/GetUserProfileWithIdRequestDto';

export class GetUserWithIdUserUseCase implements IGetUserWithIdUserUseCase {
  constructor(
    private _userRepo: IUserRepository,
    private _supporterRepo: ISupporterRepository
  ) {}

  async execute(
    data: GetUserProfileWithIdRequestDto
  ): Promise<GetUserProfileWithIdResultDto> {
    const { userId, currentUserId } = data;

    if (!userId) {
      throw new BadRequestError(USER_MESSAGES.USER_ID_REQUIRED);
    }

    let currentUser = null;
    let isSupporting = false;

    if (currentUserId) {
      currentUser = await this._userRepo.findById(currentUserId);
    }
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    if (currentUserId && currentUser) {
      isSupporting = await this._supporterRepo.isSupporting(
        currentUserId,
        userId
      );
    }

    const { supportersCount, supportingCount } =
      await this._supporterRepo.getUserSupportersAndSupportingCounts(userId);

    return { user, isSupporting, supportingCount, supportersCount };
  }
}
