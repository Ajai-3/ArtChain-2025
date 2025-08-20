import { NotFoundError } from "art-chain-shared";
import { IArtistRequestRepository } from "../../../../domain/repositories/user/IArtistRequestRepository";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { AUTH_MESSAGES } from "../../../../constants/authMessages";

export class HasUserSubmittedRequestUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _artistRequestRepo: IArtistRequestRepository
  ) {}

  async execute(
    userId: string
  ): Promise<{ alreadySubmitted: boolean; latestRequest?: any }> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(AUTH_MESSAGES.USER_NOT_FOUND);
    }

    const requests = await this._artistRequestRepo.getByUser(userId);

    if (requests.length === 0) {
      return { alreadySubmitted: false };
    }

    const latestRequest = requests[0];

    console.log(latestRequest);

    return {
      alreadySubmitted: true,
      latestRequest,
    };
  }
}
