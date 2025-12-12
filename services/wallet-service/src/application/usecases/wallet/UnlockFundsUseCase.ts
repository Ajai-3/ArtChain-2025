import { injectable, inject } from "inversify";
import { IUnlockFundsUseCase } from "../../interface/usecase/wallet/IUnlockFundsUseCase";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { logger } from "../../../utils/logger";
import { UnlockFundsDTO } from "../../interface/dto/wallet/UnlockFundsDTO";

@injectable()
export class UnlockFundsUseCase implements IUnlockFundsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(dto: UnlockFundsDTO): Promise<boolean> {
    logger.info(`Unlocking ${dto.amount} funds for user ${dto.userId} and auction ${dto.auctionId}`);   
    
    const success = await this._walletRepository.unlockAmount(dto.userId, dto.amount);
    
    if (!success) {
        logger.error(`Failed to unlock ${dto.amount} for user ${dto.userId}. Funds might not be locked.`);
        return false;
    }
    
    return true;
  }
}
