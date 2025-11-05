import { inject, injectable } from "inversify";
import { mapCdnUrl } from "../../../../utils/mapCdnUrl";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { IArtService } from "../../../interface/http/IArtService";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { USER_MESSAGES } from "../../../../constants/userMessages";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { GetUserProfileResultDto } from "../../../interface/dtos/user/profile/GetUserProfileResultDto";
import { GetUserProfileRequestDto } from "../../../interface/dtos/user/profile/GetUserProfileRequestDto";
import { IGetUserProfileUseCase } from "../../../interface/usecases/user/profile/IGetUserProfileUseCase";
@injectable()
export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    @inject(TYPES.IArtService) private readonly _artService: IArtService,
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository
  ) {}

  async execute(
    data: GetUserProfileRequestDto
  ): Promise<GetUserProfileResultDto> {
    const { username, currentUserId } = data;

    if (!username) {
      throw new BadRequestError(USER_MESSAGES.USERNAME_REQUIRED);
    }

    const user = await this._userRepo.findByUsername(username);
    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const isCurrentUser = currentUserId
      ? user.id.toString() === currentUserId
      : false;

    let isSupporting = false;
    if (!isCurrentUser && currentUserId) {
      isSupporting = await this._supporterRepo.isSupporting(
        currentUserId,
        user.id
      );
    }

    const { supportersCount, supportingCount } =
      await this._supporterRepo.getUserSupportersAndSupportingCounts(user.id);

    const artWorkCount = await this._artService.getUserArtCount(user.id);

    const formattedUser = {
      ...user,
      profileImage: mapCdnUrl(user.profileImage) || "",
      bannerImage: mapCdnUrl(user.bannerImage) || "",
      backgroundImage: mapCdnUrl(user.backgroundImage) || "",
    };

    return {
      user: formattedUser,
      isCurrentUser,
      isSupporting: isCurrentUser ? undefined : isSupporting,
      artWorkCount,
      supportingCount,
      supportersCount,
    };
  }
}
