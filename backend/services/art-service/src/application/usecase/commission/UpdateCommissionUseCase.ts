import { inject, injectable } from 'inversify';
import { TYPES } from '../../../infrastructure/Inversify/types';
import { ICommissionRepository } from '../../../domain/repositories/ICommissionRepository';
import { IUpdateCommissionUseCase } from '../../interface/usecase/commission/IUpdateCommissionUseCase';
import { CommissionMapper } from '../../mapper/CommissionMapper';
import { BadRequestError, NotFoundError, UnauthorizedError } from 'art-chain-shared';
import { CommissionStatus } from '../../../domain/entities/Commission';
import { IWalletService } from '../../../domain/interfaces/IWalletService';
import { COMMISSION_MESSAGES } from '../../../constants/CommissionMessage';

@injectable()
export class UpdateCommissionUseCase implements IUpdateCommissionUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository,
    @inject(TYPES.IWalletService)
    private readonly _walletService: IWalletService
  ) {}

  async execute(id: string, userId: string, data: any): Promise<any> {
    const commission = await this._commissionRepository.getById(id);
    
    if (!commission) {
      throw new NotFoundError(COMMISSION_MESSAGES.COMMISSION_NOT_FOUND);
    }

    const isRequester = commission.requesterId === userId;
    const isArtist = commission.artistId === userId;

    if (!isRequester && !isArtist) {
      throw new UnauthorizedError(COMMISSION_MESSAGES.USER_NOT_AUTHORIZED);
    }

    const extractKey = (url: string) => {
      if (!url) return '';
      try {
        if (url.includes('.cloudfront.net/')) {
          return url.split('.cloudfront.net/')[1];
        }
        return url;
      } catch (e) {
        return url;
      }
    };

    let updatedData: any = {
      updatedAt: new Date(),
      lastUpdatedBy: userId,
    };

    let historyDetails = '';
    const status = data.status || commission.status;

    // 1. Handling "Mutual Agreement" Flow
    if (data.status === CommissionStatus.AGREED) {
        const negotiationStatuses: CommissionStatus[] = [CommissionStatus.REQUESTED, CommissionStatus.NEGOTIATING, CommissionStatus.AGREED];
        if (!negotiationStatuses.includes(commission.status)) {
            throw new BadRequestError('Cannot agree to a commission in current status');
        }

        if (isRequester) {
            updatedData.requesterAgreed = true;
            updatedData.artistAgreed = commission.artistAgreed; // Keep original artist agreement
            historyDetails = 'Requester accepted the current terms';
        } else if (isArtist) {
            updatedData.artistAgreed = true;
            updatedData.requesterAgreed = commission.requesterAgreed; // Keep original requester agreement
            historyDetails = 'Artist accepted the current terms';
        }

        // If both parties have now agreed, set overall status to AGREED
        if (updatedData.requesterAgreed && updatedData.artistAgreed) {
            updatedData.status = CommissionStatus.AGREED;
            historyDetails = 'Both parties have agreed to the terms';
        } else {
            updatedData.status = CommissionStatus.NEGOTIATING;
        }
    } 
    // 2. Deliver Artwork (Artist Only)
    else if (data.status === CommissionStatus.DELIVERED) {
        if (!isArtist) throw new UnauthorizedError(COMMISSION_MESSAGES.USER_NOT_AUTHORIZED);
        if (commission.status !== CommissionStatus.LOCKED && commission.status !== CommissionStatus.IN_PROGRESS) {
            throw new BadRequestError('Commission must be in progress or locked to deliver artwork');
        }
        if (!data.finalArtwork) throw new BadRequestError(COMMISSION_MESSAGES.FINAL_ARTWORK_REQUIRED);
        
        updatedData.status = CommissionStatus.DELIVERED;
        
        // Handle case where finalArtwork might be an object from upload service
        let finalArt = data.finalArtwork;
        let finalImageUrl = data.finalArtwork;

        if (typeof data.finalArtwork === 'object' && data.finalArtwork !== null) {
            finalArt = data.finalArtwork.previewUrl || data.finalArtwork.originalUrl;
            finalImageUrl = data.finalArtwork.originalUrl || data.finalArtwork.previewUrl;

            // Fulfill requirement to match user IDs if present in upload metadata
            if (data.finalArtwork.userId && data.finalArtwork.userId !== userId) {
                throw new BadRequestError("Artwork update failed: Uploading user does not match the commission artist");
            }
        }

        const key = extractKey(finalArt);
        updatedData.finalArtwork = key;
        updatedData.finalImageUrl = finalImageUrl; 
        updatedData.deliveryDate = new Date();
        updatedData.autoReleaseDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        
        // TRANSFER FUNDS TO ARTIST'S LOCKED BALACO (User Requirement: dont transper money to direct wallet add in to locke d amout)
        const transferSuccess = await this._walletService.transferLockedCommissionFunds({
            fromUserId: commission.requesterId,
            toUserId: commission.artistId,
            commissionId: commission._id,
            amount: commission.budget
        });

        if (!transferSuccess) {
            throw new BadRequestError('Failed to transfer commission funds to your locked balance. Please try again.');
        }

        historyDetails = 'Artist delivered the final artwork. Funds moved to Artist locked balance.';
    } 
    // 3. Complete & Distribute Funds (Requester Only)
    else if (data.status === CommissionStatus.COMPLETED) {
        if (!isRequester) throw new UnauthorizedError(COMMISSION_MESSAGES.USER_NOT_AUTHORIZED);
        if (commission.status !== CommissionStatus.DELIVERED) {
            throw new BadRequestError('Commission must be delivered before completion');
        }

        const budget = commission.budget;
        const feePercent = commission.platformFeePercentage || 5;
        const platformFee = (budget * feePercent) / 100;
        const artistAmount = budget - platformFee;
  
        const distributeSuccess = await this._walletService.distributeCommissionFunds({
            userId: commission.requesterId,
            artistId: commission.artistId,
            commissionId: commission._id,
            totalAmount: budget,
            artistAmount: artistAmount,
            platformFee: platformFee
        });

        if (!distributeSuccess) {
            throw new BadRequestError(COMMISSION_MESSAGES.FUND_RELEASE_FAILED);
        }

        updatedData.status = CommissionStatus.COMPLETED;
        updatedData.amount = budget;
        updatedData.platformFee = platformFee;
        updatedData.completedAt = new Date();
        updatedData.completedArtImage = commission.finalArtwork;
        historyDetails = 'Requester approved the delivery. Art Coins released to Artist.';
    }
    // 4. Handle Negotiation/Updates (Resets agreement)
    else if (isRequester || isArtist) {
        const negotiationStatuses: CommissionStatus[] = [CommissionStatus.REQUESTED, CommissionStatus.NEGOTIATING, CommissionStatus.AGREED];
        if (!negotiationStatuses.includes(commission.status)) {
            // If already in progress, only dispute or deliver/complete is allowed
            if (data.status !== CommissionStatus.DISPUTE_RAISED && data.status !== CommissionStatus.CANCELLED && data.status !== CommissionStatus.LOCKED) {
                throw new BadRequestError(COMMISSION_MESSAGES.COMMISSION_NOT_IN_UPDATABLE_STATUS);
            }
        }

        // Handle specific fields (title/description artist can suggest? Usually not, but budget/deadline yes)
        if (data.budget !== undefined || data.deadline !== undefined || data.title || data.description) {
           updatedData.budget = data.budget ?? commission.budget;
           updatedData.deadline = data.deadline ?? commission.deadline;
           updatedData.title = data.title ?? commission.title;
           updatedData.description = data.description ?? commission.description;
           updatedData.referenceImages = data.referenceImages ? data.referenceImages.map(extractKey) : commission.referenceImages;
           
           // Any change to terms MUST reset agreement flags
           updatedData.requesterAgreed = isRequester; // Petitioner agrees to their own proposal
           updatedData.artistAgreed = isArtist;   // Artist agrees to their own counter-proposal
           
           if (updatedData.requesterAgreed && updatedData.artistAgreed) {
               updatedData.status = CommissionStatus.AGREED;
           } else {
               updatedData.status = CommissionStatus.NEGOTIATING;
           }
           historyDetails = `${isRequester ? 'Requester' : 'Artist'} updated commission terms`;
        } else if (data.status) {
            updatedData.status = data.status;
            historyDetails = `Status manually updated to ${data.status} by ${isRequester ? 'Requester' : 'Artist'}`;
        }
    }

    if (data.status === CommissionStatus.DISPUTE_RAISED) {
        if (!isRequester) throw new UnauthorizedError(COMMISSION_MESSAGES.USER_NOT_AUTHORIZED);
        updatedData.status = CommissionStatus.DISPUTE_RAISED;
        updatedData.disputeReason = data.disputeReason || 'No reason provided';
        historyDetails = `Dispute raised by requester: ${updatedData.disputeReason}`;
    }

    const historyEntry = {
        action: updatedData.status || commission.status,
        userId: userId,
        timestamp: new Date(),
        details: historyDetails
    };

    const updated = await this._commissionRepository.update(id, {
        ...updatedData,
        history: [...(commission.history || []), historyEntry]
    });

    return CommissionMapper.toDTO(updated);
  }
}
