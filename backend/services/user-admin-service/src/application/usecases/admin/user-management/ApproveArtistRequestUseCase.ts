import { Role } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { ILogger } from '../../../interface/ILogger';
import { IArtService } from '../../../interface/http/IArtService';
import { TYPES } from '../../../../infrastructure/inversify/types';
import { ARTIST_MESSAGES } from '../../../../constants/artistMessages';
import {
  BadRequestError,
  ERROR_MESSAGES,
  NotFoundError,
} from 'art-chain-shared';
import { IUserRepository } from '../../../../domain/repositories/user/IUserRepository';
import { ISupporterRepository } from '../../../../domain/repositories/user/ISupporterRepository';
import { IArtistRequestRepository } from '../../../../domain/repositories/user/IArtistRequestRepository';
import { ApproveArtistResultResponse } from '../../../../types/responses/admin/ApproveArtistResultResponse';
import { ArtistAproveRejectRequestDto } from '../../../interface/dtos/admin/user-management/ArtistAproveRejectRequestDto';
import { IApproveArtistRequestUseCase } from '../../../interface/usecases/admin/user-management/IApproveArtistRequestUseCase';

@injectable()
export class ApproveArtistRequestUseCase implements IApproveArtistRequestUseCase {
  constructor(
    @inject(TYPES.IUserRepository) private readonly _userRepo: IUserRepository,
    @inject(TYPES.ISupporterRepository)
    private readonly _supporterRepo: ISupporterRepository,
    @inject(TYPES.IArtistRequestRepository)
    private readonly _artistRepo: IArtistRequestRepository,
    @inject(TYPES.IArtService) private readonly _artService: IArtService,
    @inject(TYPES.ILogger) private readonly _logger: ILogger,
  ) {}

  async execute(
    dto: ArtistAproveRejectRequestDto,
  ): Promise<ApproveArtistResultResponse> {
    const { id } = dto;

    const artistRequest = await this._artistRepo.findById(id);

    if (!artistRequest) {
      throw new BadRequestError(ARTIST_MESSAGES.ARTISRT_REQUEST_NOT_FOUND);
    }

    const userId = artistRequest.userId;

    const user = await this._userRepo.findById(userId);

    if (!user) {
      throw new NotFoundError(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const { supportersCount, supportingCount } =
      await this._supporterRepo.getUserSupportersAndSupportingCounts(userId);

    if (supportersCount < 20) {
      this._logger.info('Insufficient supporters for artist request approval', {
        userId,
        supportersCount,
      });
      throw new BadRequestError(ARTIST_MESSAGES.INSUFFICIENT_SUPPORTERS);
    }
    if (supportingCount < 20) {
      this._logger.info(
        'Insufficient supporting count for artist request approval',
        {
          userId,
          supportingCount,
        },
      );
      throw new BadRequestError(ARTIST_MESSAGES.INSUFFICIENT_SUPPORTING);
    }

    const artworkCount = await this._artService.getUserArtCount(userId);
    if (artworkCount < 10) {
      this._logger.info('Insufficient artworks for artist request approval', {
        userId,
        artworkCount,
      });
      throw new BadRequestError(ARTIST_MESSAGES.INSUFFICIENT_ARTWORKS);
    }

    const updatedUser = await this._userRepo.update(userId, {
      isVerified: true,
      role: Role.artist,
    });

    const approvedRequest = await this._artistRepo.approve(id);

    this._logger.info('Artist request approved successfully', {
      requestId: id,
      userId,
    });

    return {
      user: updatedUser,
      request: approvedRequest,
    };
  }
}
