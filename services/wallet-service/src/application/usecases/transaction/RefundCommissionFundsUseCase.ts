import { inject, injectable } from "inversify";
import { Method } from "@prisma/client";
import { prisma } from "../../../infrastructure/db/prisma";
import { TransactionCategory, TransactionStatus, TransactionType } from "../../../domain/entities/Transaction";

@injectable()
export class RefundCommissionFundsUseCase {
  constructor() {}

  async execute(userId: string, commissionId: string, amount: number): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({ where: { userId } });

        if (!wallet) throw new Error("Wallet not found");
        if (wallet.lockedAmount < amount) throw new Error("Insufficient locked funds for refund");

        // 1. Update wallet (Reduce lockedAmount, increase balance)
        await tx.wallet.update({
          where: { userId },
          data: {
            balance: { increment: amount },
            lockedAmount: { decrement: amount },
          },
        });

        // 2. Create transaction record for audit
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: TransactionType.CREDITED,
            category: TransactionCategory.COMMISSION,
            amount: amount,
            method: Method.art_coin,
            status: TransactionStatus.SUCCESS,
            description: `Refund for commission dispute ${commissionId}`,
            meta: { commissionId, type: "REFUND" }
          },
        });
      });

      return true;
    } catch (error) {
      console.error("RefundCommissionFunds failed:", error);
      return false;
    }
  }
}
