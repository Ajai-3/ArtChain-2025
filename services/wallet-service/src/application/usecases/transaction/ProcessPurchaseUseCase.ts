import { inject, injectable } from "inversify";
import { Method } from "@prisma/client";
import { IProcessPurchaseUseCase } from "../../interface/usecase/transaction/IProcessPurchaseUseCase";
import { prisma } from "../../../infrastructure/db/prisma";

import { TransactionCategory, TransactionStatus, TransactionType } from "../../../domain/entities/Transaction";

@injectable()
export class ProcessPurchaseUseCase implements IProcessPurchaseUseCase {
  constructor() {}

  async execute(buyerId: string, sellerId: string, amount: number, artId: string): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Fetch Wallets
        const buyerWallet = await tx.wallet.findUnique({ where: { userId: buyerId } });
        const sellerWallet = await tx.wallet.findUnique({ where: { userId: sellerId } });

        if (!buyerWallet) throw new Error("Buyer wallet not found");
        if (!sellerWallet) throw new Error("Seller wallet not found");

        if (buyerWallet.balance < amount) {
          throw new Error("Insufficient funds");
        }

        // 2. Calculate new stats
        // Buyer
        const buyerQuickStats = (buyerWallet.quickStats as any) || { earned: 0, spent: 0, avgTransaction: 0, roi: 0, grade: "B" };
        const buyerTxSummary = (buyerWallet.transactionSummary as any) || { earned: 0, spent: 0, netGain: 0 };
        
        buyerQuickStats.spent += amount;
        buyerTxSummary.spent += amount;
        buyerTxSummary.netGain -= amount;

        // Seller
        const sellerQuickStats = (sellerWallet.quickStats as any) || { earned: 0, spent: 0, avgTransaction: 0, roi: 0, grade: "B" };
        const sellerTxSummary = (sellerWallet.transactionSummary as any) || { earned: 0, spent: 0, netGain: 0 };

        sellerQuickStats.earned += amount;
        sellerTxSummary.earned += amount;
        sellerTxSummary.netGain += amount;

        // 3. Update Wallets
        await tx.wallet.update({
          where: { userId: buyerId },
          data: {
            balance: { decrement: amount },
            quickStats: buyerQuickStats,
            transactionSummary: buyerTxSummary,
          },
        });

        await tx.wallet.update({
          where: { userId: sellerId },
          data: {
            balance: { increment: amount },
            quickStats: sellerQuickStats,
            transactionSummary: sellerTxSummary,
          },
        });

        // 4. Create Transactions
        // Buyer Transaction (Debit)
        await tx.transaction.create({
          data: {
            walletId: buyerWallet.id,
            type: TransactionType.DEBITED,
            category: TransactionCategory.PURCHASE,
            amount: amount,
            method: Method.art_coin,
            status: TransactionStatus.SUCCESS,
            description: `Purchased art ${artId}`,

          },
        });

        // Seller Transaction (Credit)
        await tx.transaction.create({
          data: {
            walletId: sellerWallet.id,
            type: TransactionType.CREDITED,
            category: TransactionCategory.SALE,
            amount: amount,
            method: Method.art_coin,
            status: TransactionStatus.SUCCESS,
            description: `Sold art ${artId}`,
          },
        });
      });

      return true;
    } catch (error) {
      console.error("Transaction failed:", error);
      return false;
    }
  }
}
