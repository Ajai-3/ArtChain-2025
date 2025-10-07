import { injectable, inject } from "inversify";
import { ArtistRequest } from "@prisma/client";
import { NotFoundError } from "art-chain-shared";
import { TYPES } from "../../../../infrastructure/inversify/types";
import { USER_MESSAGES } from "../../../../constants/userMessages";
import { IUserRepository } from "../../../../domain/repositories/user/IUserRepository";
import { IArtistRequestRepository } from "../../../../domain/repositories/user/IArtistRequestRepository";
import { ICheckUserArtistRequestUseCase } from "../../../interface/usecases/user/artist-request/ICheckUserArtistRequestUseCase";

@injectable()
export class CheckUserArtistRequestUseCase
  implements ICheckUserArtistRequestUseCase
{
  constructor(
    @inject(TYPES.IUserRepository) private _userRepo: IUserRepository,
    @inject(TYPES.IArtistRequestRepository)
    private _artistRequestRepo: IArtistRequestRepository
  ) {}

  async execute(
    userId: string
  ): Promise<{ alreadySubmitted: boolean; latestRequest?: ArtistRequest }> {
    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(USER_MESSAGES.USER_NOT_FOUND);
    }

    const requests = await this._artistRequestRepo.getByUser(userId);

    if (requests.length === 0) {
      return { alreadySubmitted: false };
    }

    const latestRequest = requests[0];

    return {
      alreadySubmitted: true,
      latestRequest,
    };
  }
}
