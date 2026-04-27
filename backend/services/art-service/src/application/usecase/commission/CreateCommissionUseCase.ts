import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { CreateCommissionDto } from '../../interface/dto/CreateCommissionDto';
import { ICreateCommissionUseCase } from '../../interface/usecase/commission/ICreateCommissionUseCase';
import {
  Commission,
  CommissionStatus,
} from '../../../domain/entities/Commission';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ICommissionRepository } from '../../../domain/repositories/ICommissionRepository';
import { IChatService } from '../../../domain/interfaces/IChatService';
import { UserService } from '../../../infrastructure/service/UserService';
import { BadRequestError, NotFoundError } from 'art-chain-shared';
import { CommissionMapper } from '../../mapper/CommissionMapper';
import { IPlatformConfigRepository } from '../../../domain/repositories/IPlatformConfigRepository';
import { COMMISSION_MESSAGES } from '../../../constants/CommissionMessage';
import type { UserPublicProfile } from '../../../types/user';
import { CreateCommissionResponse } from '../../../types/usecase-response';

@injectable()
export class CreateCommissionUseCase implements ICreateCommissionUseCase {
  constructor(
    @inject(TYPES.IUserService) private readonly _userService: UserService,
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository,
    @inject(TYPES.IChatService)
    private readonly _chatService: IChatService,
    @inject(TYPES.IPlatformConfigRepository)
    private readonly _platformConfigRepository: IPlatformConfigRepository,
  ) {}

  async execute(dto: CreateCommissionDto): Promise<CreateCommissionResponse> {
    const {
      requesterId,
      artistId,
      title,
      description,
      referenceImages,
      budget,
      deadline,
    } = dto;

    if (!requesterId || !artistId) {
      throw new BadRequestError(
        COMMISSION_MESSAGES.REQUESTER_AND_ARTIST_REQUIRED,
      );
    }

    if (requesterId === artistId) {
      throw new BadRequestError(
        COMMISSION_MESSAGES.REQUESTER_AND_ARTIST_REQUIRED,
      );
    }

    const artist = await this._userService.getUserById(artistId) as UserPublicProfile | null;
    if (!artist) {
      console.error('Artist validation failed for ID:', artistId);
      throw new NotFoundError(COMMISSION_MESSAGES.ARTIST_NOT_FOUND);
    }

    if (artist.role !== 'artist') {
      console.error('User is not an artist:', artistId);
      throw new BadRequestError(COMMISSION_MESSAGES.INVALID_ARTIST_ROLE);
    }

    let conversationId: string;
    try {
      conversationId = await this._chatService.createRequestConversation(
        requesterId,
        artistId,
      );
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw new BadRequestError(
        COMMISSION_MESSAGES.CONVERSATION_CREATION_FAILED,
      );
    }

    // 2. Create Commission Entity
    const extractKey = (url: string) => {
      if (!url) return '';
      try {
        if (url.includes('.cloudfront.net/')) {
          return url.split('.cloudfront.net/')[1];
        }
        return url;
      } catch {
        return url;
      }
    };

    // Fetch Platform Config for current commission percentage
    const platformConfig = await this._platformConfigRepository.getConfig();
    const feePercentage = platformConfig?.commissionArtPercentage || 5;

    const commission: Commission = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      requesterId,
      artistId,
      conversationId,
      title,
      description,
      referenceImages: (referenceImages || []).map(extractKey),
      budget,
      deadline,
      status: CommissionStatus.REQUESTED,
      platformFeePercentage: feePercentage,
      requesterAgreed: false,
      artistAgreed: false,
      history: [
        {
          action: CommissionStatus.REQUESTED,
          userId: requesterId,
          timestamp: new Date(),
          details: 'Commission Requested',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 3. Save to Repository
    const createdCommission =
      await this._commissionRepository.create(commission);

    return CommissionMapper.toDTO(createdCommission);
  }
}
