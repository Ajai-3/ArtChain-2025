import {
  BadRequestError,
  ERROR_MESSAGES,
  NotFoundError,
} from 'art-chain-shared';
import { ArtistAproveRejectRequestDto } from '../../../interface/dtos/admin/user-management/ArtistAproveRejectRequestDto';
import { IArtistRequestRepository } from '../../../../domain/repositories/user/IArtistRequestRepository';
import { IRejectArtistRequestUseCase } from '../../../interface/usecases/admin/user-management/IRejectArtistRequestUseCase';
import { ARTIST_MESSAGES } from '../../../../constants/artistMessages';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';

export class RejectArtistRequestUseCase implements IRejectArtistRequestUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _artistRepo: IArtistRequestRepository
  ) {}

  async execute(dto: ArtistAproveRejectRequestDto): Promise<any> {
    const { id, reason } = dto;

    const artistRequest = await this._artistRepo.findById(id);

    if (!artistRequest) {
      throw new BadRequestError(ARTIST_MESSAGES.ARTISRT_REQUEST_NOT_FOUND);
    }

    const userId = artistRequest.userId;

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    if (!reason) {
      throw new BadRequestError(
        ARTIST_MESSAGES.ARTIST_REQUEST_REJECT_REASON_NOT_FOUND
      );
    }

    return this._artistRepo.reject(id, reason);
  }
}
