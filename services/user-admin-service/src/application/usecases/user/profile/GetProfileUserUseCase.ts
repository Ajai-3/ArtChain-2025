import { BadRequestError, NotFoundError } from "art-chain-shared";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";
import { USER_MESSAGES } from "../../../../constants/userMessages";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { ISupporterRepository } from "../../../../domain/repositories/user/ISupporterRepository";
import { GetUserProfileRequestDto } from "../../../interface/dtos/user/profile/GetUserProfileRequestDto";
import { ArtService } from "../../../../infrastructure/http/ArtService";
import { GetUserProfileResultDto } from "../../../interface/dtos/user/profile/GetUserProfileResultDto";
import { IGetUserProfileUseCase } from "../../../interface/usecases/user/profile/IGetUserProfileUseCase";

export class GetUserProfileUseCase implements IGetUserProfileUseCase {
  constructor(
    private readonly _artService: ArtService,
    private readonly _userRepo: IUserRepository,
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

    return {
      user,
      isCurrentUser,
      isSupporting: isCurrentUser ? undefined : isSupporting,
      artWorkCount,
      supportingCount,
      supportersCount,
    };
  }
}
