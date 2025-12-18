import { inject, injectable } from "inversify";
import { TYPES } from "../../../infrastructure/Inversify/types";
import { ICommissionRepository } from "../../../domain/repositories/ICommissionRepository";
import { BadRequestError, NotFoundError } from "art-chain-shared";
import { CommissionStatus } from "../../../domain/entities/Commission";
import { IWalletService } from "../../../domain/interfaces/IWalletService";
import { CommissionMapper } from "../../mapper/CommissionMapper";

@injectable()
export class ResolveCommissionDisputeUseCase {
  constructor(
    @inject(TYPES.ICommissionRepository)
    private readonly _commissionRepository: ICommissionRepository,
    @inject(TYPES.IWalletService)
    private readonly _walletService: IWalletService
  ) {}

  async execute(id: string, resolution: "REFUND" | "RELEASE"): Promise<any> {
    const commission = await this._commissionRepository.getById(id);
    if (!commission) throw new NotFoundError("Commission not found");

    if (commission.status !== CommissionStatus.DISPUTE_RAISED) {
      throw new BadRequestError("Commission is not in dispute");
    }

    let success = false;
    if (resolution === "REFUND") {
      // Return funds to requester
      success = await this._walletService.refundCommissionFunds({
        userId: commission.requesterId,
        commissionId: commission._id,
        amount: commission.budget
      });
      if (success) {
        await this._commissionRepository.update(id, {
          status: CommissionStatus.CANCELLED,
          history: [...(commission.history || []), {
            action: "DISPUTE_RESOLVED_REFUND",
            userId: "SYSTEM_ADMIN",
            timestamp: new Date(),
            details: "Admin resolved dispute by refunding the requester."
          }]
        });
      }
    } else {
      // Release funds to artist
      const feePercent = commission.platformFeePercentage || 5;
      const platformFee = (commission.budget * feePercent) / 100;
      const artistAmount = commission.budget - platformFee;

      success = await this._walletService.distributeCommissionFunds({
        userId: commission.requesterId,
        artistId: commission.artistId,
        commissionId: commission._id,
        totalAmount: commission.budget,
        artistAmount: artistAmount,
        platformFee: platformFee
      });

      if (success) {
        await this._commissionRepository.update(id, {
          status: CommissionStatus.COMPLETED,
          amount: commission.budget,
          platformFee: platformFee,
          history: [...(commission.history || []), {
            action: "DISPUTE_RESOLVED_RELEASE",
            userId: "SYSTEM_ADMIN",
            timestamp: new Date(),
            details: "Admin resolved dispute by releasing funds to the artist."
          }]
        });
      }
    }

    if (!success) throw new BadRequestError("Failed to process dispute resolution in wallet service");

    const updated = await this._commissionRepository.getById(id);
    return CommissionMapper.toDTO(updated!);
  }
}
