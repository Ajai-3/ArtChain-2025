import { inject, injectable } from "inversify";
import { Method } from "@prisma/client";
import { ILockCommissionFundsUseCase } from "../../interface/usecase/transaction/ILockCommissionFundsUseCase";
import { prisma } from "../../../infrastructure/db/prisma";
import { TransactionCategory, TransactionStatus, TransactionType } from "../../../domain/entities/Transaction";

@injectable()
export class LockCommissionFundsUseCase implements ILockCommissionFundsUseCase {
  constructor() {}

  async execute(userId: string, commissionId: string, amount: number): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({ where: { userId } });

        if (!wallet) throw new Error("Wallet not found");
        if (wallet.balance < amount) throw new Error("Insufficient funds");

        // 1. Update wallet (Deduct balance, ADD to lockedAmount)
        await tx.wallet.update({
          where: { userId },
          data: {
            balance: { decrement: amount },
            lockedAmount: { increment: amount },
          },
        });

        // 2. Create transaction record for audit
        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: TransactionType.DEBITED,
            category: TransactionCategory.COMMISSION,
            amount: amount,
            method: Method.art_coin,
            status: TransactionStatus.SUCCESS,
            description: `Funds locked for commission agreement ${commissionId}`,
            meta: { commissionId, type: "LOCK" }
          },
        });
      });

      return true;
    } catch (error) {
      console.error("LockCommissionFunds failed:", error);
      return false;
    }
  }
}
