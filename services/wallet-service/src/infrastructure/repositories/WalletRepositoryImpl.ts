import { prisma } from "../db/prisma";
import { injectable } from "inversify";
import { Wallet } from "../../domain/entities/Wallet";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { IWalletRepository } from "../../domain/repository/IWalletRepository.js";

@injectable()
export class WalletRepositoryImpl
  extends BaseRepositoryImpl<Wallet>
  implements IWalletRepository
{
  protected model = prisma.wallet;

  getByUserId(userId: string) {
    return this.model.findUnique({ where: { userId } });
  }
  async getTransactionStats(walletId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const allTransactions = await prisma.transaction.findMany({
      where: {
        walletId,
        createdAt: { gte: startOfMonth },
      },
      select: {
        type: true,
        amount: true,
        category: true,
      },
    });

    const earned = allTransactions
      .filter(
        (tx) =>
          tx.type === "credited" &&
          (tx.category === "SALE" || tx.category === "COMMISSION")
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const spent = allTransactions
      .filter((tx) => tx.type === "debited" && tx.category === "PURCHASE")
      .reduce((sum, tx) => sum + tx.amount, 0);

      
    const avgTransaction =
      allTransactions.length > 0
        ? +(
            allTransactions.reduce((sum, tx) => sum + tx.amount, 0) /
            allTransactions.length
          ).toFixed(2)
        : 0;

    return { earned, spent, avgTransaction };
  }
}
