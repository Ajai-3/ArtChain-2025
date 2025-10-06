import { BadRequestError, NotFoundError } from "art-chain-shared";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { USER_MESSAGES } from "../../../../constants/userMessages";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { GetUserProfileRequestDto } from "../../../interface/dtos/user/profile/GetUserProfileRequestDto";

export class GetUserWithIdUserUseCase {
  constructor(private readonly _userRepo: IUserRepository, private readonly _supporterRepo: ISupporterRepository) {}

  async execute(data: GetUserProfileRequestDto): Promise<any> {
    const { userId, currentUserId } = data;

    if (!userId) {
      throw new BadRequestError(USER_MESSAGES.USER_ID_REQUIRED);
    }

    const fullUser = await this._userRepo.findById(userId);
    if (!fullUser) {
      throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const { supportersCount, supportingCount } = await this._supporterRepo.getUserSupportersAndSupportingCounts(userId);

    let isSupporting = false;
    if (currentUserId) {
      isSupporting = await this._supporterRepo.isSupporting(currentUserId, userId);
    }

    const user = {
      id: fullUser.id,
      name: fullUser.name,
      username: fullUser.username,
      profileImage: fullUser.profileImage,
      bannerImage: fullUser.bannerImage,
      status: fullUser.status,
      isVerified: fullUser.isVerified,
      plan: fullUser.plan,
      supportersCount,
      supportingCount,
      isSupporting
    };

    return user;
  }
}
