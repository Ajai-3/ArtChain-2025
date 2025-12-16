import { inject, injectable } from "inversify";
import { BadRequestError } from "art-chain-shared";
import { TYPES } from "../../../infrastructure/inversify/types";
import { WALLET_MESSAGES } from "../../../constants/WalletMessages";
import { IWalletRepository } from "../../../domain/repository/IWalletRepository";
import { IGetWalletUseCase } from "../../interface/usecase/wallet/IGetWalletUseCase";

@injectable()
export class GetWalletUseCase implements IGetWalletUseCase {
  constructor(
    @inject(TYPES.IWalletRepository)
    private readonly _walletRepo: IWalletRepository
  ) {}

  async execute(userId: string) {
    if (!userId) throw new BadRequestError(WALLET_MESSAGES.USER_ID_MISSING);

    let wallet = await this._walletRepo.getByUserId(userId);
    if (!wallet) {
      wallet = await this._walletRepo.create({
        userId,
        balance: 0,
        status: "active",
      });
    }

    const stats = await this._walletRepo.getTransactionStats(wallet.id);
    const { earned, spent, avgTransaction } = stats;
    const netGain = earned - spent;
    const roi =
      wallet.balance > 0
        ? `${((netGain / wallet.balance) * 100).toFixed(2)}%`
        : "0%";

    const transactionSummary = {
      earned,
      spent,
      netGain,
    };

    let grade = "-";
    if (roi !== "0%") {
      const roiNum = parseFloat(roi);
      if (roiNum > 50) grade = "A";
      else if (roiNum > 20) grade = "B";
      else grade = "C";
    }

    // Fetch all transactions for charts (frontend will handle filtering)
    const transactions = await this._walletRepo.getRecentTransactions(wallet.id, 1000);

    return {
      balance: wallet.balance,
      inrValue: wallet.balance * 10,
      lockedAmount: wallet.lockedAmount,
      quickStats: { earned, spent, avgTransaction, roi, grade },
      transactionSummary,
      transactions, // Include transactions for chart rendering
    };
  }
}
