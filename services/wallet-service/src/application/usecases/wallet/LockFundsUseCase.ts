import { injectable, inject } from "inversify";
import { ILockFundsUseCase } from "../../interface/usecase/wallet/ILockFundsUseCase";
import { TYPES } from "../../../infrastructure/inversify/types";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { logger } from "../../../utils/logger";
import { BadRequestError } from "art-chain-shared";
import { LockFundsDTO } from "../../interface/dto/wallet/LockFundsDTO";

@injectable()
export class LockFundsUseCase implements ILockFundsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepository: IWalletRepository
  ) {}

  async execute(dto: LockFundsDTO): Promise<boolean> {
    logger.info(`Locking ${dto.amount} funds for user ${dto.userId} and auction ${dto.auctionId}`);
    
    const success = await this._walletRepository.lockAmount(dto.userId, dto.amount);
    
    if (!success) {
        logger.warn(`Insufficient funds to lock ${dto.amount} for user ${dto.userId}`);
        throw new BadRequestError("Insufficient funds to place bid.");
    }
    
    return true;
  }
}
