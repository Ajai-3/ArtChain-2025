import { inject, injectable } from "inversify";
import { Method } from "@prisma/client";
import { IDistributeCommissionFundsUseCase } from "../../interface/usecase/transaction/IDistributeCommissionFundsUseCase";
import { prisma } from "../../../infrastructure/db/prisma";
import { TransactionCategory, TransactionStatus, TransactionType } from "../../../domain/entities/Transaction";

@injectable()
export class DistributeCommissionFundsUseCase implements IDistributeCommissionFundsUseCase {
  constructor() {}

  async execute(params: {
    userId: string;
    artistId: string;
    commissionId: string;
    totalAmount: number;
    artistAmount: number;
    platformFee: number;
  }): Promise<boolean> {
    const { userId, artistId, commissionId, totalAmount, artistAmount, platformFee } = params;

    try {
      await prisma.$transaction(async (tx) => {
        const userWallet = await tx.wallet.findUnique({ where: { userId } });
        const artistWallet = await tx.wallet.findUnique({ where: { userId: artistId } });

        if (!userWallet) throw new Error("User wallet not found");
        if (!artistWallet) throw new Error("Artist wallet not found");
        if (userWallet.lockedAmount < totalAmount) throw new Error("Insufficient locked funds");

        // 1. Update User Wallet (Deduct from lockedAmount)
        await tx.wallet.update({
          where: { userId },
          data: {
            lockedAmount: { decrement: totalAmount },
          },
        });

        // 2. Update Artist Wallet (Increment balance)
        await tx.wallet.update({
          where: { userId: artistId },
          data: {
            balance: { increment: artistAmount },
            transactionSummary: {
               upsert: {
                  update: { earned: { increment: artistAmount }, netGain: { increment: artistAmount } },
                  set: { earned: artistAmount, netGain: artistAmount, spent: 0 }
               }
            } as any // Simplified for now, in a real system we'd merge the JSON
          },
        });

        // 3. Create Transactions
        // Artist Credit
        await tx.transaction.create({
          data: {
            walletId: artistWallet.id,
            type: TransactionType.CREDITED,
            category: TransactionCategory.COMMISSION,
            amount: artistAmount,
            method: Method.art_coin,
            status: TransactionStatus.SUCCESS,
            description: `Commission payment received for ${commissionId}`,
            meta: { commissionId, type: "RELEASE" }
          },
        });

        // Admin/Platform Fee (We can create a special platform wallet later, or just log it for now)
        // For now, let's just log it in the user's transaction history as a platform fee
        await tx.transaction.create({
            data: {
              walletId: userWallet.id,
              type: TransactionType.DEBITED,
              category: TransactionCategory.COMMISSION,
              amount: platformFee,
              method: Method.art_coin,
              status: TransactionStatus.SUCCESS,
              description: `Platform fee for commission ${commissionId}`,
              meta: { commissionId, type: "FEE" }
            },
        });
      });

      return true;
    } catch (error) {
      console.error("DistributeCommissionFunds failed:", error);
      return false;
    }
  }
}
