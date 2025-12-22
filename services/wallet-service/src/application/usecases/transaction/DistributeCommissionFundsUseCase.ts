import { inject, injectable } from "inversify";
import { Method } from "@prisma/client";
import { IDistributeCommissionFundsUseCase } from "../../interface/usecase/transaction/IDistributeCommissionFundsUseCase";
import { prisma } from "../../../infrastructure/db/prisma";
import { TransactionCategory, TransactionStatus, TransactionType } from "../../../domain/entities/Transaction";
import { config } from "../../../infrastructure/config/env";

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

        // Admin/Platform Fee
        // Credit the Platform Admin Wallet
        const adminId = config.platform_admin_id;
        
        const adminWallet = await tx.wallet.upsert({
            where: { userId: adminId },
            create: { userId: adminId, balance: platformFee },
            update: { balance: { increment: platformFee } }
        });

        // Create Credit Transaction for Admin
        await tx.transaction.create({
            data: {
              walletId: adminWallet.id,
              type: TransactionType.CREDITED,
              category: TransactionCategory.COMMISSION,
              amount: platformFee,
              method: Method.art_coin,
              status: TransactionStatus.SUCCESS,
              description: `Commission from commission work ${commissionId}`,
              externalId: commissionId,
              meta: { buyerId: userId, artistId }
            }
        });

        // Create Debit Transaction for User (already covered in deducted lockedAmount, 
        // but we record the fee explicitly as a separate transaction for clarity if needed, 
        // OR we consider the fee deduction as part of the totalAmount transfer. 
        // In this model, the user paid 'totalAmount' which included the fee.
        // We already deducted 'totalAmount' from locked funds.
        // So we just need to record where that money went.
        // - artistAmount -> Artist Wallet
        // - platformFee -> Admin Wallet
        
        // Log the fee deduction in User's history
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
