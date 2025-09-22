import { ArtistRequest } from '@prisma/client';
import { NotFoundError } from 'art-chain-shared';
import { USER_MESSAGES } from '../../../../constants/userMessages';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { IArtistRequestRepository } from '../../../../domain/repositories/user/IArtistRequestRepository';
import { ICheckUserArtistRequestUseCase } from '../../../../domain/usecases/user/artist-request/ICheckUserArtistRequestUseCase';


export class CheckUserArtistRequestUseCase implements ICheckUserArtistRequestUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _artistRequestRepo: IArtistRequestRepository
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
