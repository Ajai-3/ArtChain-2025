import { injectable, inject } from "inversify";
import { IProcessSplitPurchaseUseCase } from "../../interface/usecase/transaction/IProcessSplitPurchaseUseCase";
import { ProcessSplitPurchaseDTO } from "../../interface/dto/transaction/ProcessSplitPurchaseDTO";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { logger } from "../../../utils/logger";
import { config } from "../../../infrastructure/config/env";

@injectable()
export class ProcessSplitPurchaseUseCase implements IProcessSplitPurchaseUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(dto: ProcessSplitPurchaseDTO): Promise<boolean> {
    const adminId = config.platform_admin_id
    logger.info(
      `Processing split purchase for art ${dto.artId}: Buyer=${dto.buyerId}, Seller=${dto.sellerId}, Admin=${adminId}, Total=${dto.totalAmount}, Commission=${dto.commissionAmount}`
    );

    return this._walletRepository.processSplitPurchase(
      dto.buyerId,
      dto.sellerId,
      adminId,
      dto.totalAmount,
      dto.commissionAmount,
      dto.artId
    );
  }
}
