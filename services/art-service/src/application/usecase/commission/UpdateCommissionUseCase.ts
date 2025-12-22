import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommissionRepository } from "../../../domain/repositories/ICommissionRepository";
import { IUpdateCommissionUseCase } from "../../interface/usecase/commission/IUpdateCommissionUseCase";
import { CommissionMapper } from "../../mapper/CommissionMapper";
import { BadRequestError, NotFoundError, UnauthorizedError } from "art-chain-shared";
import { CommissionStatus } from "../../../domain/entities/Commission";
import { IWalletService } from "../../../domain/interfaces/IWalletService";

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
      throw new NotFoundError("Commission not found");
    }

    const isRequester = commission.requesterId === userId;
    const isArtist = commission.artistId === userId;

    if (!isRequester && !isArtist) {
      throw new UnauthorizedError("Not authorized to update this commission");
    }

    // Only allow update if in initial stages
    const allowUpdateStatus: CommissionStatus[] = [CommissionStatus.REQUESTED, CommissionStatus.NEGOTIATING];
    if (!allowUpdateStatus.includes(commission.status) && !data.status) {
        throw new BadRequestError(`Cannot update commission in ${commission.status} status`);
    }

    const extractKey = (url: string) => {
      if (!url) return "";
      try {
        if (url.includes(".cloudfront.net/")) {
          return url.split(".cloudfront.net/")[1];
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

    const action = data.status || "UPDATED";
    let historyDetails = "";

    // 1. Handle Status-Specific workflows
    if (data.status === CommissionStatus.DELIVERED) {
        if (!isArtist) throw new UnauthorizedError("Only artist can deliver");
        if (commission.status !== CommissionStatus.LOCKED && commission.status !== CommissionStatus.IN_PROGRESS) {
            throw new BadRequestError("Commission not in progress");
        }
        if (!data.finalArtwork) throw new BadRequestError("Final artwork is required for delivery");
        
        updatedData.status = CommissionStatus.DELIVERED;
        updatedData.finalArtwork = extractKey(data.finalArtwork);
        updatedData.deliveryDate = new Date();
        updatedData.autoReleaseDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
        historyDetails = "Artist delivered the final artwork";
    } 
    else if (data.status === CommissionStatus.COMPLETED) {
        if (!isRequester) throw new UnauthorizedError("Only requester can approve completion");
        if (commission.status !== CommissionStatus.DELIVERED) {
            throw new BadRequestError("Commission must be delivered before completion");
        }

        // Trigger Wallet Distribution
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
            throw new BadRequestError("Failed to release funds. Please try again or contact support.");
        }

        updatedData.status = CommissionStatus.COMPLETED;
        updatedData.amount = budget;
        updatedData.platformFee = platformFee;
        historyDetails = "Requester approved the delivery. Project completed.";
    }
    else if (data.status === CommissionStatus.DISPUTE_RAISED) {
        if (!isRequester) throw new UnauthorizedError("Only requester can raise dispute");
        
        const isPastDeadline = new Date() > new Date(commission.deadline);
        const isInProgressOrLocked = commission.status === CommissionStatus.LOCKED || commission.status === CommissionStatus.IN_PROGRESS;

        if (commission.status !== CommissionStatus.DELIVERED && (!isInProgressOrLocked || !isPastDeadline)) {
            throw new BadRequestError("Can only raise dispute after delivery or if deadline passed");
        }

        updatedData.status = CommissionStatus.DISPUTE_RAISED;
        updatedData.disputeReason = data.disputeReason || "No reason provided";
        historyDetails = `Dispute raised by requester: ${updatedData.disputeReason}`;
    }
    else if (isRequester) {
        // Initial stages negotiation
        const negotiationStatuses: CommissionStatus[] = [CommissionStatus.REQUESTED, CommissionStatus.NEGOTIATING];
        if (!negotiationStatuses.includes(commission.status)) {
            throw new BadRequestError(`Cannot update commission in ${commission.status} status`);
        }
        updatedData = {
            ...updatedData,
            ...data,
            referenceImages: data.referenceImages ? data.referenceImages.map(extractKey) : commission.referenceImages,
        };
        historyDetails = data.status ? `Status changed to ${data.status} by requester` : "Commission details updated by requester";
    } else if (isArtist) {
        // Artist can only update budget, deadline, and status in initial stages
        const negotiationStatuses: CommissionStatus[] = [CommissionStatus.REQUESTED, CommissionStatus.NEGOTIATING];
        if (!negotiationStatuses.includes(commission.status)) {
             throw new BadRequestError(`Cannot update commission in ${commission.status} status`);
        }
        if (data.status) {
            updatedData.status = data.status;
            historyDetails = `Status changed to ${data.status} by artist`;
        }
        
        if (data.budget || data.deadline) {
            updatedData.budget = data.budget ?? commission.budget;
            updatedData.deadline = data.deadline ?? commission.deadline;
            updatedData.status = CommissionStatus.NEGOTIATING; // Suggesting changes
            historyDetails = "Artist suggested changes to budget/deadline";
        }
    }

    // Add to history
    const historyEntry = {
        action: action,
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
