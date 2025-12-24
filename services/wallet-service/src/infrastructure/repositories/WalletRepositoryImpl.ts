import { prisma } from "../db/prisma";
import { injectable } from "inversify";
import { config } from "../config/env";
import { Wallet } from "../../domain/entities/Wallet";
import { BaseRepositoryImpl } from "./BaseRepositoryImpl";
import { Transaction, TransactionCategory } from "../../domain/entities/Transaction";
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
        const sender = await tx.wallet.findUnique({ where: { userId: fromId } });
        
        if (!sender) throw new Error("Sender wallet not found");
        if (sender.balance < amount) throw new Error("Insufficient funds");

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

        const resolvedCategory = Object.values(TransactionCategory).includes(category as any) 
            ? (category as TransactionCategory) 
            : TransactionCategory.OTHER;

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

        //
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
      category: { in: [
        TransactionCategory.COMMISSION, 
        TransactionCategory.OTHER,
        TransactionCategory.AUCTION_FEE,
        TransactionCategory.SALE_FEE,
        TransactionCategory.COMMISSION_FEE
      ] } 
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
      commissions: 0,
      aiGeneration: 0,
      other: 0
    };

    const chartDataMap = new Map<string, number>();

    for (const tx of transactions) {
      const amount = tx.amount;
      totalRevenue += amount;

      if (tx.category === TransactionCategory.AUCTION_FEE) {
        breakdown.auctions += amount;
      } else if (tx.category === TransactionCategory.SALE_FEE) {
        breakdown.artSales += amount;
      } else if (tx.category === TransactionCategory.COMMISSION_FEE) {
         breakdown.commissions += amount;
      } else if (tx.category === TransactionCategory.COMMISSION) {
         // Legacy fallback
         const desc = tx.description ? tx.description.toLowerCase() : "";
         if (desc.includes("auction")) {
             breakdown.auctions += amount;
         } else if (desc.includes("sale") || desc.includes("sold")) {
             breakdown.artSales += amount;
         } else if (desc.includes("request") || desc.includes("custom")) {
             breakdown.commissions += amount;
         } else {
             breakdown.commissions += amount;
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
    const dateFilter = startDate ? `AND "createdAt" >= ${startDate.toISOString() ? `'${startDate.toISOString()}'` : 'NOW()'}` : '';
    
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
        const winnerWallet = await tx.wallet.update({
          where: { userId: winnerId },
          data: { 
            lockedAmount: { decrement: totalAmount }
          }
        });

        const sellerWallet = await tx.wallet.upsert({
            where: { userId: sellerId },
            create: { userId: sellerId, balance: sellerAmount },
            update: { balance: { increment: sellerAmount } }
        });

        const adminWallet = await tx.wallet.upsert({
            where: { userId: adminId },
            create: { userId: adminId, balance: commissionAmount },
            update: { balance: { increment: commissionAmount } }
        });

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

        if (commissionAmount > 0) {
            await tx.transaction.create({
                data: {
                    walletId: adminWallet.id,
                    type: "credited",
                    amount: commissionAmount,
                    category: "AUCTION_FEE",
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
        const buyerWallet = await tx.wallet.findUnique({ where: { userId: buyerId } });
        const sellerWallet = await tx.wallet.findUnique({ where: { userId: sellerId } });
        
        if (!buyerWallet) throw new Error("Buyer wallet not found");
        if (!sellerWallet) throw new Error("Seller wallet not found");
        
        if (buyerWallet.balance < totalAmount) {
          throw new Error("Insufficient funds");
        }

        const buyerQuickStats = (buyerWallet.quickStats as any) || { earned: 0, spent: 0, avgTransaction: 0, roi: 0, grade: "B" };
        const buyerTxSummary = (buyerWallet.transactionSummary as any) || { earned: 0, spent: 0, netGain: 0 };
        buyerQuickStats.spent += totalAmount;
        buyerTxSummary.spent += totalAmount;
        buyerTxSummary.netGain -= totalAmount;

        const sellerQuickStats = (sellerWallet.quickStats as any) || { earned: 0, spent: 0, avgTransaction: 0, roi: 0, grade: "B" };
        const sellerTxSummary = (sellerWallet.transactionSummary as any) || { earned: 0, spent: 0, netGain: 0 };
        sellerQuickStats.earned += sellerAmount;
        sellerTxSummary.earned += sellerAmount;
        sellerTxSummary.netGain += sellerAmount;

        await tx.wallet.update({
          where: { userId: buyerId },
          data: {
            balance: { decrement: totalAmount },
            quickStats: buyerQuickStats,
            transactionSummary: buyerTxSummary,
          },
        });

        await tx.wallet.update({
          where: { userId: sellerId },
          data: {
            balance: { increment: sellerAmount },
            quickStats: sellerQuickStats,
            transactionSummary: sellerTxSummary,
          },
        });

        let adminWalletId;
        if (commissionAmount > 0) {
            const updatedAdmin = await tx.wallet.upsert({
                where: { userId: adminId },
                create: { userId: adminId, balance: commissionAmount },
                update: { balance: { increment: commissionAmount } }
            });
            adminWalletId = updatedAdmin.id;
        }

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

        if (commissionAmount > 0 && adminWalletId) {
            await tx.transaction.create({
                data: {
                    walletId: adminWalletId,
                    type: "credited",
                    amount: commissionAmount,
                    category: "SALE_FEE",
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

  async getAllRecentTransactions(limit: number): Promise<any[]> {
    const txs = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        wallet: {
            select: {
                userId: true
            }
        }
      }
    });

    return txs.map((tx: any) => ({
      id: tx.id,
      userId: tx.wallet?.userId,
      date: tx.createdAt.toISOString(),
      type: tx.type === "credited" ? "Earned" : "Spent",
      amount: tx.amount,
      category: tx.category,
      status: tx.status,
      method: tx.method,
      description: tx.description
    }));
  }

  async distributeCommissionFunds(params: {
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
            } as any 
          },
        });

        // 3. Create Transactions
        // Artist Credit
        await tx.transaction.create({
          data: {
            walletId: artistWallet.id,
            type: "credited",
            category: TransactionCategory.COMMISSION,
            amount: artistAmount,
            method: "art_coin",
            status: "success",
            description: `Commission payment received for ${commissionId}`,
            meta: { commissionId, type: "RELEASE" }
          },
        });

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
              type: "credited",
              category: TransactionCategory.COMMISSION_FEE,
              amount: platformFee,
              method: "art_coin",
              status: "success",
              description: `Commission from commission work ${commissionId}`,
              externalId: commissionId,
              meta: { buyerId: userId, artistId }
            }
        });

        // Log the fee deduction in User's history
        await tx.transaction.create({
            data: {
              walletId: userWallet.id,
              type: "debited",
              category: TransactionCategory.COMMISSION_FEE,
              amount: platformFee,
              method: "art_coin",
              status: "success",
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

  async lockCommissionFunds(userId: string, commissionId: string, amount: number): Promise<boolean> {
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
            type: "debited",
            category: TransactionCategory.COMMISSION,
            amount: amount,
            method: "art_coin",
            status: "success",
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

  async refundCommissionFunds(userId: string, commissionId: string, amount: number): Promise<boolean> {
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
            type: "credited",
            category: TransactionCategory.COMMISSION,
            amount: amount,
            method: "art_coin",
            status: "success",
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

  // ==================================================================================
  // ADMIN WALLET MANAGEMENT METHODS (Merged from AdminWalletRepositoryImpl)
  // ==================================================================================

  async findAllWallets(
    page: number,
    limit: number,
    filters?: import("../../domain/repository/IWalletRepository").WalletFilters
  ): Promise<{ 
    data: any[]; 
    meta: { total: number; page: number; limit: number };
    stats?: {
      total: number;
      active: number;
      suspended: number;
      locked: number;
    }
  }> {
    const skip = (page - 1) * limit;

    const baseWhere: any = {
      userId: { not: config.platform_admin_id },
    };

    const where: any = { ...baseWhere };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.minBalance !== undefined) {
      where.balance = { ...where.balance, gte: filters.minBalance };
    }
    if (filters?.maxBalance !== undefined) {
      where.balance = { ...where.balance, lte: filters.maxBalance };
    }

    const total = await prisma.wallet.count({ where });

    const wallets = await prisma.wallet.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Calculate global stats (ignoring view filters but excluding admins)
    const [active, suspended, locked, totalWallets] = await Promise.all([
      prisma.wallet.count({ where: { ...baseWhere, status: 'active' } }),
      prisma.wallet.count({ where: { ...baseWhere, status: 'suspended' } }),
      prisma.wallet.count({ where: { ...baseWhere, status: 'locked' } }),
      prisma.wallet.count({ where: baseWhere }),
    ]);

    const stats = {
      total: totalWallets,
      active,
      suspended,
      locked
    };

    const data = wallets.map(wallet => ({
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      lockedAmount: wallet.lockedAmount,
      status: wallet.status,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
      lastTransaction: wallet.transactions[0] || null,
    }));

    return {
      data,
      stats,
      meta: { total, page, limit },
    };
  }

  async findWalletsByUserIds(
    userIds: string[],
    page: number,
    limit: number,
    filters?: import("../../domain/repository/IWalletRepository").WalletFilters
  ): Promise<{ 
    data: any[]; 
    meta: { total: number; page: number; limit: number };
    stats?: {
      total: number;
      active: number;
      suspended: number;
      locked: number;
    }
  }> {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: { in: userIds },
    };
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.minBalance !== undefined) {
      where.balance = { ...where.balance, gte: filters.minBalance };
    }
    if (filters?.maxBalance !== undefined) {
      where.balance = { ...where.balance, lte: filters.maxBalance };
    }

    // Get total count
    const total = await prisma.wallet.count({ where });

    // Get wallets with last transaction
    const wallets = await prisma.wallet.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    // Calculate global stats (ignoring view filters but excluding admin)
    const baseWhere: any = {
      userId: { not: config.platform_admin_id },
    };

    const [active, suspended, locked, totalWallets] = await Promise.all([
      prisma.wallet.count({ where: { ...baseWhere, status: 'active' } }),
      prisma.wallet.count({ where: { ...baseWhere, status: 'suspended' } }),
      prisma.wallet.count({ where: { ...baseWhere, status: 'locked' } }),
      prisma.wallet.count({ where: baseWhere }),
    ]);

    const stats = {
      total: totalWallets,
      active,
      suspended,
      locked
    };

    // Format data
    const data = wallets.map(wallet => ({
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      lockedAmount: wallet.lockedAmount,
      status: wallet.status,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
      lastTransaction: wallet.transactions[0] || null,
    }));

    return {
      data,
      stats,
      meta: { total, page, limit },
    };
  }

  async findWalletByUserId(userId: string): Promise<any | null> {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!wallet) return null;

    return {
      id: wallet.id,
      userId: wallet.userId,
      balance: wallet.balance,
      lockedAmount: wallet.lockedAmount,
      status: wallet.status,
      createdAt: wallet.createdAt,
      updatedAt: wallet.updatedAt,
      lastTransaction: wallet.transactions[0] || null,
    };
  }

  async updateWalletStatus(
    walletId: string,
    status: 'active' | 'locked' | 'suspended'
  ): Promise<Wallet> {
    const updated = await prisma.wallet.update({
      where: { id: walletId },
      data: { status, updatedAt: new Date() },
    });

    return new Wallet(
      updated.id,
      updated.userId,
      updated.balance,
      updated.lockedAmount,
      updated.status as 'active' | 'locked' | 'suspended',
      updated.createdAt,
      updated.updatedAt
    );
  }

  async getTransactionsByWalletId(
    walletId: string,
    page: number,
    limit: number,
    filters?: import("../../domain/repository/IWalletRepository").TransactionFilters
  ): Promise<{ data: Transaction[]; meta: { total: number; page: number; limit: number } }> {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { walletId };
    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.category) {
      where.category = filters.category;
    }
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) {
        where.createdAt.gte = filters.startDate;
      }
      if (filters.endDate) {
        where.createdAt.lte = filters.endDate;
      }
    }

    // Get total count
    const total = await prisma.transaction.count({ where });

    // Get transactions
    const transactions = await prisma.transaction.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Map to Transaction entities
    const data = transactions.map(
      tx =>
        new Transaction(
          tx.id,
          tx.walletId,
          tx.type as 'credited' | 'debited',
          tx.category as any,
          tx.amount,
          tx.method as 'stripe' | 'razorpay',
          tx.status as 'pending' | 'success' | 'failed',
          tx.externalId,
          tx.description,
          tx.meta as any,
          tx.createdAt,
          tx.updatedAt
        )
    );

    return {
      data,
      meta: { total, page, limit },
    };
  }
}
