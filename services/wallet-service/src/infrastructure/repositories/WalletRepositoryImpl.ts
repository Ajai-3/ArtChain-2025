import { prisma } from "../db/prisma";
import { injectable } from "inversify";
import { Wallet } from "../../domain/entities/Wallet";
import { TransactionCategory } from "../../domain/entities/Transaction";
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

  async transferFunds(
    fromId: string,
    toId: string,
    amount: number,
    description: string,
    referenceId: string,
    category: string
  ): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Fetch
        const sender = await tx.wallet.findUnique({ where: { userId: fromId } });
        
        if (!sender) throw new Error("Sender wallet not found");
        if (sender.balance < amount) throw new Error("Insufficient funds");

        // 2. Update Sender
        const senderQuickStats = (sender.quickStats as any) || { earned: 0, spent: 0 };
        const senderTxSummary = (sender.transactionSummary as any) || { earned: 0, spent: 0, netGain: 0 };
        senderQuickStats.spent += amount;
        senderTxSummary.spent += amount;
        senderTxSummary.netGain -= amount;

        await tx.wallet.update({
            where: { userId: fromId },
            data: {
                balance: { decrement: amount },
                quickStats: senderQuickStats,
                transactionSummary: senderTxSummary
            }
        });

        // 3. Update Receiver
        const receiver = await tx.wallet.upsert({
            where: { userId: toId },
            create: { userId: toId, balance: amount },
            update: { balance: { increment: amount } }
        });
        
        const receiverQuickStats = (receiver.quickStats as any) || { earned: 0, spent: 0 };
        const receiverTxSummary = (receiver.transactionSummary as any) || { earned: 0, spent: 0, netGain: 0 };
        receiverQuickStats.earned += amount;
        receiverTxSummary.earned += amount;
        receiverTxSummary.netGain += amount;
        
        await tx.wallet.update({
            where: { id: receiver.id },
            data: {
                quickStats: receiverQuickStats,
                transactionSummary: receiverTxSummary
            }
        });

        // Resolve Category
        const resolvedCategory = Object.values(TransactionCategory).includes(category as any) 
            ? (category as TransactionCategory) 
            : TransactionCategory.OTHER;

        // 4. Create Transactions
        // Debit Sender
        await tx.transaction.create({
            data: {
                walletId: sender.id,
                type: "debited",
                category: resolvedCategory,
                amount: amount,
                method: "art_coin",
                status: "success",
                description: description,
                externalId: referenceId,
                meta: { recipientId: toId }
            }
        });

        // Credit Receiver
        await tx.transaction.create({
            data: {
                walletId: receiver.id,
                type: "credited",
                category: resolvedCategory, 
                amount: amount,
                method: "art_coin",
                status: "success",
                description: description,
                externalId: referenceId,
                meta: { senderId: fromId }
            }
        });
      });
      return true;
    } catch (error) {
       console.error("Transfer Funds Error:", error);
       return false;
    }
  }

  async getRevenueStats(adminId: string, startDate?: Date, endDate?: Date): Promise<any> {
    const whereClause: any = {
      wallet: { userId: adminId },
      type: "credited",
      category: { in: [TransactionCategory.COMMISSION, TransactionCategory.OTHER] } 
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      select: {
        amount: true,
        category: true,
        description: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });

    let totalRevenue = 0;
    const breakdown = {
      auctions: 0,
      artSales: 0,
      aiGeneration: 0,
      other: 0
    };

    const chartDataMap = new Map<string, number>();

    for (const tx of transactions) {
      const amount = tx.amount;
      totalRevenue += amount;

      if (tx.category === TransactionCategory.COMMISSION) {
         if (tx.description && tx.description.toLowerCase().includes("auction")) {
             breakdown.auctions += amount;
         } else if (tx.description && (tx.description.toLowerCase().includes("sale") || tx.description.toLowerCase().includes("art"))) {
             breakdown.artSales += amount;
         } else {
             breakdown.other += amount;
         }
      } else if (tx.category === TransactionCategory.OTHER && tx.description && tx.description.toLowerCase().includes("ai")) {
          breakdown.aiGeneration += amount;
      } else {
          breakdown.other += amount;
      }

      const date = tx.createdAt.toISOString().split('T')[0];
      const current = chartDataMap.get(date) || 0;
      chartDataMap.set(date, current + amount);
    }
    
    const chartData = Array.from(chartDataMap.entries())
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      totalRevenue,
      breakdown,
      chartData
    };
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

  async getRecentTransactions(walletId: string, limit: number) {
    const txs = await prisma.transaction.findMany({
      where: { walletId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    
    return txs.map(tx => ({
      id: tx.id,
      date: tx.createdAt.toISOString(),
      type: tx.type === "credited" ? "Earned" : "Spent", 
      amount: tx.amount,
      category: tx.category,
      status: tx.status,
      method: tx.method,
      description: tx.description
    }));
  }

  async getTransactionsWithFilter(walletId: string, timeRange?: "7d" | "1m" | "all") {
    const now = new Date();
    let startDate: Date | undefined;

    if (timeRange === "7d") {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === "1m") {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    }
    // If timeRange is "all" or undefined, startDate remains undefined (no filter)

    const whereClause: any = { walletId };
    if (startDate) {
      whereClause.createdAt = { gte: startDate };
    }

    const txs = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return txs.map(tx => ({
      id: tx.id,
      date: tx.createdAt.toISOString(),
      type: tx.type === "credited" ? "Earned" : "Spent",
      amount: tx.amount,
      category: tx.category,
      status: tx.status,
      method: tx.method,
      description: tx.description
    }));

  }

  async getDailyStats(walletId: string, startDate?: Date): Promise<any[]> {
    // Efficient aggregation using Raw SQL for Postgres
    // Groups by date and type to get daily sums
    const dateFilter = startDate ? `AND "createdAt" >= ${startDate.toISOString() ? `'${startDate.toISOString()}'` : 'NOW()'}` : '';
    
    // Note: Prisma QueryRaw requires careful table name usage. 
    // Assuming table name is "Transaction" based on standard Prisma mapping.
    // Using CAST("createdAt" as DATE) for grouping.
    
    return await prisma.$queryRawUnsafe(`
      SELECT 
        "createdAt"::DATE as date,
        "type",
        SUM("amount") as total_amount,
        COUNT(*) as count_tx
      FROM "Transaction"
      WHERE "walletId" = '${walletId}'
      ${startDate ? `AND "createdAt" >= '${startDate.toISOString()}'` : ''}
      GROUP BY "createdAt"::DATE, "type"
      ORDER BY date ASC
    `);
  }

  async getCategoryStats(walletId: string, startDate?: Date): Promise<any[]> {
    const where: any = { walletId };
    if (startDate) {
        where.createdAt = { gte: startDate };
    }

    const stats = await prisma.transaction.groupBy({
        by: ['category', 'type'],
        where,
        _sum: {
            amount: true
        }
    });
    
    return stats;
  }
  async lockAmount(userId: string, amount: number): Promise<boolean> {
    const result = await this.model.updateMany({
      where: {
        userId,
        balance: { gte: amount },
      },
      data: {
        balance: { decrement: amount },
        lockedAmount: { increment: amount },
      },
    });
    return result.count > 0;
  }

  async unlockAmount(userId: string, amount: number): Promise<boolean> {
    const result = await this.model.updateMany({
      where: {
        userId,
        lockedAmount: { gte: amount },
      },
      data: {
        balance: { increment: amount },
        lockedAmount: { decrement: amount },
      },
    });
    return result.count > 0;
  }

  async settleAuctionFunds(
    winnerId: string,
    sellerId: string,
    adminId: string,
    totalAmount: number,
    commissionAmount: number,
    auctionId: string
  ): Promise<boolean> {
    try {
      const sellerAmount = totalAmount - commissionAmount;

      await prisma.$transaction(async (tx) => {
        // 1. Deduct from Winner (Locked)
        const winnerWallet = await tx.wallet.update({
          where: { userId: winnerId },
          data: { 
            lockedAmount: { decrement: totalAmount }
          }
        });

        // 2. Credit Seller
        const sellerWallet = await tx.wallet.upsert({
            where: { userId: sellerId },
            create: { userId: sellerId, balance: sellerAmount },
            update: { balance: { increment: sellerAmount } }
        });

        // 3. Credit Admin
        const adminWallet = await tx.wallet.upsert({
            where: { userId: adminId },
            create: { userId: adminId, balance: commissionAmount },
            update: { balance: { increment: commissionAmount } }
        });

        // 4. Create Transactions
        // Debit Winner
        await tx.transaction.create({
            data: {
                walletId: winnerWallet.id,
                type: "debited",
                amount: totalAmount,
                category: "PURCHASE",
                method: "art_coin",
                status: "success",
                description: `Payment for auction ${auctionId}`,
                externalId: auctionId,
                meta: { sellerId, adminId, commissionAmount }
            }
        });

        // Credit Seller
        await tx.transaction.create({
             data: {
                walletId: sellerWallet.id,
                type: "credited",
                amount: sellerAmount,
                category: "SALE",
                method: "art_coin",
                status: "success",
                description: `Sale proceeds from auction ${auctionId}`,
                externalId: auctionId,
                meta: { buyerId: winnerId }
             }
        });

        // Credit Admin
        if (commissionAmount > 0) {
            await tx.transaction.create({
                data: {
                    walletId: adminWallet.id,
                    type: "credited",
                    amount: commissionAmount,
                    category: "COMMISSION",
                    method: "art_coin",
                    status: "success",
                    description: `Commission from auction ${auctionId}`,
                    externalId: auctionId,
                    meta: { buyerId: winnerId, sellerId }
                }
            });
        }
      });
      return true;
    } catch (error) {
      console.error("Settle Auction Error:", error);
      return false;
    }
  }

  async processSplitPurchase(
    buyerId: string,
    sellerId: string,
    adminId: string,
    totalAmount: number,
    commissionAmount: number,
    artId: string
  ): Promise<boolean> {
    try {
      const sellerAmount = totalAmount - commissionAmount;

      await prisma.$transaction(async (tx) => {
        // 1. Fetch Wallets
        const buyerWallet = await tx.wallet.findUnique({ where: { userId: buyerId } });
        const sellerWallet = await tx.wallet.findUnique({ where: { userId: sellerId } });
        
        if (!buyerWallet) throw new Error("Buyer wallet not found");
        if (!sellerWallet) throw new Error("Seller wallet not found");
        
        if (buyerWallet.balance < totalAmount) {
          throw new Error("Insufficient funds");
        }

        // 2. Calculate Stats (Buyer)
        const buyerQuickStats = (buyerWallet.quickStats as any) || { earned: 0, spent: 0, avgTransaction: 0, roi: 0, grade: "B" };
        const buyerTxSummary = (buyerWallet.transactionSummary as any) || { earned: 0, spent: 0, netGain: 0 };
        buyerQuickStats.spent += totalAmount;
        buyerTxSummary.spent += totalAmount;
        buyerTxSummary.netGain -= totalAmount;

        // 3. Calculate Stats (Seller)
        const sellerQuickStats = (sellerWallet.quickStats as any) || { earned: 0, spent: 0, avgTransaction: 0, roi: 0, grade: "B" };
        const sellerTxSummary = (sellerWallet.transactionSummary as any) || { earned: 0, spent: 0, netGain: 0 };
        sellerQuickStats.earned += sellerAmount;
        sellerTxSummary.earned += sellerAmount;
        sellerTxSummary.netGain += sellerAmount;

        // 4. Update Wallets
        // Debit Buyer
        await tx.wallet.update({
          where: { userId: buyerId },
          data: {
            balance: { decrement: totalAmount },
            quickStats: buyerQuickStats,
            transactionSummary: buyerTxSummary,
          },
        });

        // Credit Seller
        await tx.wallet.update({
          where: { userId: sellerId },
          data: {
            balance: { increment: sellerAmount },
            quickStats: sellerQuickStats,
            transactionSummary: sellerTxSummary,
          },
        });

        // Credit Admin
        let adminWalletId;
        if (commissionAmount > 0) {
            const updatedAdmin = await tx.wallet.upsert({
                where: { userId: adminId },
                create: { userId: adminId, balance: commissionAmount },
                update: { balance: { increment: commissionAmount } }
            });
            adminWalletId = updatedAdmin.id;
        }

        // 5. Create Transactions
        // Debit Buyer
        await tx.transaction.create({
          data: {
            walletId: buyerWallet.id,
            type: "debited",
            category: "PURCHASE",
            amount: totalAmount,
            method: "art_coin",
            status: "success",
            description: `Purchased art ${artId}`,
            externalId: artId,
             meta: { sellerId, adminId, commissionAmount }
          },
        });

        // Credit Seller
        await tx.transaction.create({
          data: {
            walletId: sellerWallet.id,
            type: "credited",
            category: "SALE",
            amount: sellerAmount,
            method: "art_coin",
            status: "success",
            description: `Sold art ${artId}`,
            externalId: artId,
             meta: { buyerId }
          },
        });

         // Credit Admin
        if (commissionAmount > 0 && adminWalletId) {
            await tx.transaction.create({
                data: {
                    walletId: adminWalletId,
                    type: "credited",
                    amount: commissionAmount,
                    category: "COMMISSION",
                    method: "art_coin",
                    status: "success",
                    description: `Commission from art sale ${artId}`,
                    externalId: artId,
                    meta: { buyerId, sellerId }
                }
            });
        }
      });

      return true;
    } catch (error) {
      console.error("Process Split Purchase Error:", error);
      return false;
    }
  }

  async getAdminCommissionTransactions(
    walletId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any[]> {
    const whereClause: any = {
      walletId,
      type: 'credited',
      category: { in: [TransactionCategory.COMMISSION, TransactionCategory.OTHER, TransactionCategory.TOP_UP] },
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      select: {
        amount: true,
        category: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return transactions;
  }

}
