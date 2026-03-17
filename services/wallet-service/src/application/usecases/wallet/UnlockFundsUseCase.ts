import { injectable, inject } from 'inversify';
import { IUnlockFundsUseCase } from '../../interface/usecase/wallet/IUnlockFundsUseCase';
import { TYPES } from '../../../infrastructure/inversify/types';
import { IWalletRepository } from '../../../domain/repository/IWalletRepository';
import { logger } from '../../../utils/logger';
import { UnlockFundsDTO } from '../../interface/dto/wallet/UnlockFundsDTO';
import { BadRequestError } from 'art-chain-shared';
import { WALLET_MESSAGES } from '../../../constants/WalletMessages';

@injectable()
export class UnlockFundsUseCase implements IUnlockFundsUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepo: IWalletRepository,
  ) {}

  async execute(dto: UnlockFundsDTO): Promise<boolean> {
    logger.info(
      `Unlocking ${dto.amount} funds for user ${dto.userId} and auction ${dto.auctionId}`,
    );

    const wallet = await this._walletRepo.getByUserId(dto.userId);

    if (!wallet) {
      throw new BadRequestError(WALLET_MESSAGES.WALLET_NOT_FOUND);
    }

    if (wallet.lockedAmount < dto.amount) {
      logger.error(
        `Cannot unlock ${dto.amount} for user ${dto.userId}. Locked amount is only ${wallet.lockedAmount}.`,
      );
      throw new BadRequestError(WALLET_MESSAGES.INSUFFICIENT_LOCKED_FUNDS);
    }

    const success = await this._walletRepo.unlockAmount(dto.userId, dto.amount);

    if (!success) {
      logger.error(
        `Failed to unlock ${dto.amount} for user ${dto.userId}. Funds might not be locked.`,
      );
      throw new BadRequestError(WALLET_MESSAGES.INSUFFICIENT_LOCKED_FUNDS);
    }

    return true;
  }
}
