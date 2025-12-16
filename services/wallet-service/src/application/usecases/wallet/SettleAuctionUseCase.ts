import { injectable, inject } from "inversify";
import { ISettleAuctionUseCase } from "../../interface/usecase/wallet/ISettleAuctionUseCase";
import { SettleAuctionDTO } from "../../interface/dto/wallet/SettleAuctionDTO";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { logger } from "../../../utils/logger";

@injectable()
export class SettleAuctionUseCase implements ISettleAuctionUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(dto: SettleAuctionDTO): Promise<boolean> {
    logger.info(
      `Settling auction ${dto.auctionId}: Winner=${dto.winnerId}, Seller=${dto.sellerId}, Admin=${dto.adminId}, Total=${dto.totalAmount}, Commission=${dto.commissionAmount}`
    );

    return this._walletRepository.settleAuctionFunds(
      dto.winnerId,
      dto.sellerId,
      dto.adminId,
      dto.totalAmount,
      dto.commissionAmount,
      dto.auctionId
    );
  }
}
