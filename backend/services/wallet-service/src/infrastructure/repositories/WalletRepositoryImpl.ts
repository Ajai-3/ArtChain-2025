import { prisma } from '../db/prisma';
import { logger } from '../../utils/logger';
import { injectable } from 'inversify';
import { config } from '../config/env';
import { Wallet } from '../../domain/entities/Wallet';
import { BaseRepositoryImpl } from './BaseRepositoryImpl';
import {
  Transaction,
  TransactionCategory,
  TransactionMethod,
  TransactionStatus,
  TransactionType,
} from '../../domain/entities/Transaction';
import {
  IWalletRepository,
  TransactionFilters,
  WalletFilters,
  RecentTransaction,
  AdminTransaction,
} from '../../domain/repository/IWalletRepository';
import { Prisma } from '@prisma/client';
import {
  RevenueStatsResponse,
  RevenueBreakdown,
  RevenueTrendItem,
} from '../../types/Revenue';
import { DailyTransactionStat } from '../../types/TransactionStats';
import { QuickStats, TransactionSummary } from '../../types/Wallet';
import { BadRequestError, NotFoundError } from 'art-chain-shared';

@injectable()
export class WalletRepositoryImpl
  extends BaseRepositoryImpl<Wallet>
  implements IWalletRepository
{
  protected model = prisma.wallet;

  async getByUserId(userId: string): Promise<Wallet | null> {
    const result = await this.model.findUnique({ where: { userId } });
    return result as Wallet | null;
  }

  async transferFunds(
    fromId: string,
    toId: string,
    amount: number,
    description: string,
    referenceId: string,
    category: string,
  ): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const sender = await tx.wallet.findUnique({
          where: { userId: fromId },
        });

        if (!sender) throw new BadRequestError('Sender wallet not found');
        if (sender.balance < amount)
          throw new BadRequestError('Insufficient funds');

        const senderQuickStats =
          (sender.quickStats as unknown as QuickStats) || {
            earned: 0,
            spent: 0,
          };
        const senderTxSummary =
          (sender.transactionSummary as unknown as TransactionSummary) || {
            earned: 0,
            spent: 0,
            netGain: 0,
          };
        senderQuickStats.spent += amount;
        senderTxSummary.spent += amount;
        senderTxSummary.netGain -= amount;

        await tx.wallet.update({
          where: { userId: fromId },
          data: {
            balance: { decrement: amount },
            quickStats: senderQuickStats as unknown as Prisma.InputJsonValue,
            transactionSummary: senderTxSummary as unknown as Prisma.InputJsonValue,
          },
        });

        const receiver = await tx.wallet.upsert({
          where: { userId: toId },
          create: { userId: toId, balance: amount },
          update: { balance: { increment: amount } },
        });

        const receiverQuickStats =
          (receiver.quickStats as unknown as QuickStats) || {
            earned: 0,
            spent: 0,
          };
        const receiverTxSummary =
          (receiver.transactionSummary as unknown as TransactionSummary) || {
            earned: 0,
            spent: 0,
            netGain: 0,
          };
        receiverQuickStats.earned += amount;
        receiverTxSummary.earned += amount;
        receiverTxSummary.netGain += amount;

        await tx.wallet.update({
          where: { id: receiver.id },
          data: {
            quickStats: receiverQuickStats as unknown as Prisma.InputJsonValue,
            transactionSummary: receiverTxSummary as unknown as Prisma.InputJsonValue,
          },
        });

        const resolvedCategory = Object.values(TransactionCategory).includes(
          category as TransactionCategory,
        )
          ? (category as TransactionCategory)
          : TransactionCategory.OTHER;

        await tx.transaction.create({
          data: {
            walletId: sender.id,
            type: TransactionType.DEBITED,
            category: resolvedCategory,
            amount: amount,
            method: TransactionMethod.ART_COIN,
            status: TransactionStatus.SUCCESS,
            description: description,
            externalId: `${referenceId}-debit`,
            meta: { recipientId: toId },
          },
        });

        //
        await tx.transaction.create({
          data: {
            walletId: receiver.id,
            type: TransactionType.CREDITED,
            category: resolvedCategory,
            amount: amount,
            method: TransactionMethod.ART_COIN,
            status: TransactionStatus.SUCCESS,
            description: description,
            externalId: `${referenceId}-credit`,
            meta: { senderId: fromId },
          },
        });
      });
      return true;
    } catch (error) {
      console.error('Transfer Funds Error:', error);
      return false;
    }
  }

  async getRevenueStats(
    adminId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<RevenueStatsResponse> {
    const baseWhere: Prisma.TransactionWhereInput = {
      wallet: { userId: adminId },
      type: 'credited',
      category: {
        in: [
          TransactionCategory.AUCTION_FEE,
          TransactionCategory.SALE_FEE,
          TransactionCategory.COMMISSION_FEE,
        ],
      },
    };

    const allTransactions = await prisma.transaction.findMany({
      where: baseWhere,
      select: {
        amount: true,
        category: true,
        createdAt: true,
      },
    });

    let overallTotalRevenue = 0;
    const overallBreakdown = {
      auctions: { amount: 0, count: 0 },
      artSales: { amount: 0, count: 0 },
      commissions: { amount: 0, count: 0 },
    };

    for (const tx of allTransactions) {
      const amount = tx.amount;
      overallTotalRevenue += amount;
      if (tx.category === TransactionCategory.AUCTION_FEE) {
        overallBreakdown.auctions.amount += amount;
        overallBreakdown.auctions.count += 1;
      } else if (tx.category === TransactionCategory.SALE_FEE) {
        overallBreakdown.artSales.amount += amount;
        overallBreakdown.artSales.count += 1;
      } else if (tx.category === TransactionCategory.COMMISSION_FEE) {
        overallBreakdown.commissions.amount += amount;
        overallBreakdown.commissions.count += 1;
      }
    }

    const trendTransactions = allTransactions.filter((tx) => {
      if (startDate && tx.createdAt < startDate) return false;
      if (endDate && tx.createdAt > endDate) return false;
      return true;
    });

    let trendTotalRevenue = 0;
    const trendBreakdown = {
      auctions: { amount: 0, count: 0 },
      artSales: { amount: 0, count: 0 },
      commissions: { amount: 0, count: 0 },
    };
    const chartDataMap = new Map<string, number>();

    for (const tx of trendTransactions) {
      const amount = tx.amount;
      trendTotalRevenue += amount;

      if (tx.category === TransactionCategory.AUCTION_FEE) {
        trendBreakdown.auctions.amount += amount;
        trendBreakdown.auctions.count += 1;
      } else if (tx.category === TransactionCategory.SALE_FEE) {
        trendBreakdown.artSales.amount += amount;
        trendBreakdown.artSales.count += 1;
      } else if (tx.category === TransactionCategory.COMMISSION_FEE) {
        trendBreakdown.commissions.amount += amount;
        trendBreakdown.commissions.count += 1;
      }

      const date = tx.createdAt.toISOString().split('T')[0];
      const current = chartDataMap.get(date) || 0;
      chartDataMap.set(date, current + amount);
    }

    const chartData = Array.from(chartDataMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
      overallTotalRevenue,
      overallBreakdown,
      trendTotalRevenue: trendTotalRevenue,
      trendBreakdown,
      trendData: chartData,
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
          tx.type === 'credited' &&
          (tx.category === 'SALE' || tx.category === 'COMMISSION'),
      )
      .reduce((sum, tx) => sum + tx.amount, 0);

    const spent = allTransactions
      .filter((tx) => tx.type === 'debited' && tx.category === 'PURCHASE')
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
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return txs.map((tx) => ({
      id: tx.id,
      date: tx.createdAt.toISOString(),
      type: tx.type === 'credited' ? 'Earned' : 'Spent',
      amount: tx.amount,
      category: tx.category,
      status: tx.status,
      method: tx.method,
      description: tx.description,
    }));
  }

  async getTransactionsWithFilter(
    walletId: string,
    timeRange?: '7d' | '1m' | 'all',
  ) {
    const now = new Date();
    let startDate: Date | undefined;

    if (timeRange === '7d') {
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
    } else if (timeRange === '1m') {
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
    }

    const whereClause: Prisma.TransactionWhereInput = { walletId };
    if (startDate) {
      whereClause.createdAt = { gte: startDate };
    }

    const txs = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return txs.map((tx) => ({
      id: tx.id,
      date: tx.createdAt.toISOString(),
      type: tx.type === 'credited' ? 'Earned' : 'Spent',
      amount: tx.amount,
      category: tx.category,
      status: tx.status,
      method: tx.method,
      description: tx.description,
    }));
  }

  async getDailyStats(walletId: string, startDate?: Date) {
    const results = await prisma.transaction.groupBy({
      by: ['type', 'category', 'createdAt'],
      where: {
        walletId,
        ...(startDate && {
          createdAt: {
            gte: startDate,
          },
        }),
      },
      _sum: {
        amount: true,
      },
      _count: {
        _all: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return results.map((item) => ({
      date: item.createdAt.toISOString().split('T')[0],
      type: item.type,
      category: item.category,
      total_amount: Number(item._sum.amount || 0),
      count_tx: item._count._all,
    }));
  }

  async getCategoryStats(walletId: string, startDate?: Date): Promise<{ type: string; category: string; _sum: { amount: number } }[]> {
    const where: Prisma.TransactionWhereInput = { walletId };
    if (startDate) {
      where.createdAt = { gte: startDate };
    }

    const stats = await prisma.transaction.groupBy({
      by: ['category', 'type'],
      where,
      _sum: {
        amount: true,
      },
    });

    return stats.map((s) => ({
      type: s.type as string,
      category: s.category as string,
      _sum: { amount: s._sum.amount ?? 0 },
    }));
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
    auctionId: string,
  ): Promise<boolean> {
    try {
      const sellerAmount = totalAmount - commissionAmount;

      logger.info(
        `[WalletRepository] Starting settlement transaction for auction ${auctionId}. Total: ${totalAmount}, SellerAmt: ${sellerAmount}, AdminAmt: ${commissionAmount}`,
      );

      await prisma.$transaction(
        async (tx) => {
          // First verify winner wallet exists to avoid Prisma error on update
          const winnerWalletCheck = await tx.wallet.findUnique({
            where: { userId: winnerId },
          });

          if (!winnerWalletCheck) {
            throw new NotFoundError(
              `Winner wallet not found for user: ${winnerId}`,
            );
          }

          let lockedDecrement = totalAmount;
          let balanceDecrement = 0;

          if (winnerWalletCheck.lockedAmount < totalAmount) {
            logger.warn(
              `[WalletRepository] Winner wallet lockedAmount (${winnerWalletCheck.lockedAmount}) is less than totalAmount (${totalAmount}). Taking remainder from balance.`,
            );
            lockedDecrement = winnerWalletCheck.lockedAmount;
            balanceDecrement = totalAmount - winnerWalletCheck.lockedAmount;
          } else {
            logger.info(
              `[WalletRepository] Updating winner wallet ${winnerId}. Current lockedAmount: ${winnerWalletCheck.lockedAmount}. Decrementing by ${totalAmount}`,
            );
          }

          const updateData: Prisma.WalletUpdateInput = {};
          if (lockedDecrement > 0) {
            updateData.lockedAmount = { decrement: lockedDecrement };
          }
          if (balanceDecrement > 0) {
            updateData.balance = { decrement: balanceDecrement };
          }

          const winnerWallet = await tx.wallet.update({
            where: { userId: winnerId },
            data: updateData,
          });
          logger.info(
            `[WalletRepository] Winner wallet updated. New lockedAmount: ${winnerWallet.lockedAmount}, New balance: ${winnerWallet.balance}`,
          );

          logger.info(
            `[WalletRepository] Upserting seller wallet ${sellerId}. Incrementing balance by ${sellerAmount}`,
          );
          const sellerWallet = await tx.wallet.upsert({
            where: { userId: sellerId },
            create: { userId: sellerId, balance: sellerAmount },
            update: { balance: { increment: sellerAmount } },
          });
          logger.info(
            `[WalletRepository] Seller wallet updated. New balance: ${sellerWallet.balance}`,
          );

          logger.info(
            `[WalletRepository] Upserting admin wallet ${adminId}. Incrementing balance by ${commissionAmount}`,
          );
          const adminWallet = await tx.wallet.upsert({
            where: { userId: adminId },
            create: { userId: adminId, balance: commissionAmount },
            update: { balance: { increment: commissionAmount } },
          });
          logger.info(
            `[WalletRepository] Admin wallet updated. New balance: ${adminWallet.balance}`,
          );

          logger.info(
            '[WalletRepository] Creating debit transaction record for winner',
          );
          await tx.transaction.create({
            data: {
              walletId: winnerWallet.id,
              type: 'debited',
              amount: totalAmount,
              category: 'PURCHASE',
              method: 'art_coin',
              status: 'success',
              description: `Payment for auction ${auctionId}`,
              externalId: `${auctionId}-auction-winner`,
              meta: { sellerId, adminId, commissionAmount },
            },
          });

          logger.info(
            '[WalletRepository] Creating credit transaction record for seller',
          );
          await tx.transaction.create({
            data: {
              walletId: sellerWallet.id,
              type: 'credited',
              amount: sellerAmount,
              category: 'SALE',
              method: 'art_coin',
              status: 'success',
              description: `Sale proceeds from auction ${auctionId}`,
              externalId: `${auctionId}-sold`,
              meta: { buyerId: winnerId },
            },
          });

          if (commissionAmount > 0) {
            await tx.transaction.create({
              data: {
                walletId: adminWallet.id,
                type: 'credited',
                amount: commissionAmount,
                category: 'AUCTION_FEE',
                method: 'art_coin',
                status: 'success',
                description: `Commission from auction ${auctionId}`,
                externalId: `${auctionId}-commission`,
                meta: { buyerId: winnerId, sellerId },
              },
            });
          }
          logger.info(
            '[WalletRepository] Settlement transaction committed successfully for',
            auctionId,
          );
        },
        { timeout: 30000 },
      );
      return true;
    } catch (error) {
      logger.error(
        '[WalletRepository] Settle Auction Transaction ERROR:',
        error,
      );
      return false;
    }
  }

  async processSplitPurchase(
    buyerId: string,
    sellerId: string,
    adminId: string,
    totalAmount: number,
    commissionAmount: number,
    artId: string,
  ): Promise<boolean> {
    try {
      const sellerAmount = totalAmount - commissionAmount;

      await prisma.$transaction(async (tx) => {
        const buyerWallet = await tx.wallet.findUnique({
          where: { userId: buyerId },
        });
        const sellerWallet = await tx.wallet.findUnique({
          where: { userId: sellerId },
        });

        if (!buyerWallet) throw new NotFoundError('Buyer wallet not found');
        if (!sellerWallet) throw new NotFoundError('Seller wallet not found');

        const existingTx = await tx.transaction.findUnique({
          where: { externalId: `${artId}-purchase` },
        });

        if (existingTx) {
          logger.info(
            `Transaction ${artId}-purchase already exists, skipping wallet updates.`,
          );
          return;
        }

        if (buyerWallet.balance < totalAmount) {
          throw new Error('Insufficient funds');
        }

        const buyerQuickStats = (buyerWallet.quickStats as unknown as QuickStats) || {
          earned: 0,
          spent: 0,
        };
        const buyerTxSummary = (buyerWallet.transactionSummary as unknown as TransactionSummary) || {
          earned: 0,
          spent: 0,
          netGain: 0,
        };
        buyerQuickStats.spent += totalAmount;
        buyerTxSummary.spent += totalAmount;
        buyerTxSummary.netGain -= totalAmount;

        const sellerQuickStats = (sellerWallet.quickStats as unknown as QuickStats) || {
          earned: 0,
          spent: 0,
        };
        const sellerTxSummary = (sellerWallet.transactionSummary as unknown as TransactionSummary) || {
          earned: 0,
          spent: 0,
          netGain: 0,
        };
        sellerQuickStats.earned += sellerAmount;
        sellerTxSummary.earned += sellerAmount;
        sellerTxSummary.netGain += sellerAmount;

        await tx.wallet.update({
          where: { userId: buyerId },
          data: {
            balance: { decrement: totalAmount },
            quickStats: buyerQuickStats as unknown as Prisma.InputJsonValue,
            transactionSummary: buyerTxSummary as unknown as Prisma.InputJsonValue,
          },
        });

        await tx.wallet.update({
          where: { userId: sellerId },
          data: {
            balance: { increment: sellerAmount },
            quickStats: sellerQuickStats as unknown as Prisma.InputJsonValue,
            transactionSummary: sellerTxSummary as unknown as Prisma.InputJsonValue,
          },
        });

        let adminWalletId;
        if (commissionAmount > 0) {
          const updatedAdmin = await tx.wallet.upsert({
            where: { userId: adminId },
            create: { userId: adminId, balance: commissionAmount },
            update: { balance: { increment: commissionAmount } },
          });
          adminWalletId = updatedAdmin.id;
        }

        await tx.transaction.create({
          data: {
            walletId: buyerWallet.id,
            type: 'debited',
            category: 'PURCHASE',
            amount: totalAmount,
            method: 'art_coin',
            status: 'success',
            description: `Purchased art ${artId}`,
            externalId: `${artId}-purchase`,
            meta: { sellerId, adminId, commissionAmount },
          },
        });

        await tx.transaction.create({
          data: {
            walletId: sellerWallet.id,
            type: 'credited',
            category: 'SALE',
            amount: sellerAmount,
            method: 'art_coin',
            status: 'success',
            description: `Sold art ${artId}`,
            externalId: `${artId}-sale`,
            meta: { buyerId },
          },
        });

        if (commissionAmount > 0 && adminWalletId) {
          await tx.transaction.create({
            data: {
              walletId: adminWalletId,
              type: 'credited',
              amount: commissionAmount,
              category: 'SALE_FEE',
              method: 'art_coin',
              status: 'success',
              description: `Commission from art sale ${artId}`,
              externalId: `${artId}-commission`,
              meta: { buyerId, sellerId },
            },
          });
        }
      });

      return true;
    } catch (error) {
      console.error('Process Split Purchase Error:', error);
      return false;
    }
  }

  async getAdminTransactions(
    adminId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AdminTransaction[]> {
    const whereClause: Prisma.TransactionWhereInput = {
      wallet: { userId: adminId },
      type: 'credited',
      category: {
        in: [
          TransactionCategory.COMMISSION,
          TransactionCategory.OTHER,
          TransactionCategory.TOP_UP,
          TransactionCategory.AUCTION_FEE,
          TransactionCategory.SALE_FEE,
          TransactionCategory.COMMISSION_FEE,
        ],
      },
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      walletId: tx.walletId,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      method: tx.method,
      status: tx.status,
      externalId: tx.externalId,
      description: tx.description,
      meta: (tx.meta ?? null) as Record<string, unknown> | null,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));
  }

  async getAdminCommissionTransactions(
    walletId: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<AdminTransaction[]> {
    const whereClause: Prisma.TransactionWhereInput = {
      walletId,
      type: 'credited',
      category: {
        in: [
          TransactionCategory.COMMISSION,
          TransactionCategory.OTHER,
          TransactionCategory.TOP_UP,
        ],
      },
    };

    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = startDate;
      if (endDate) whereClause.createdAt.lte = endDate;
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((tx) => ({
      id: tx.id,
      walletId: tx.walletId,
      type: tx.type,
      category: tx.category,
      amount: tx.amount,
      method: tx.method,
      status: tx.status,
      externalId: tx.externalId,
      description: tx.description,
      meta: (tx.meta ?? null) as Record<string, unknown> | null,
      createdAt: tx.createdAt,
      updatedAt: tx.updatedAt,
    }));
  }

  async getAllRecentTransactions(limit: number): Promise<RecentTransaction[]> {
    const txs = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        wallet: {
          select: {
            userId: true,
          },
        },
      },
    });

    return txs.map((tx) => ({
      id: tx.id,
      userId: tx.wallet?.userId,
      date: tx.createdAt.toISOString(),
      type: tx.type === 'credited' ? 'Earned' : 'Spent',
      amount: tx.amount,
      category: tx.category,
      status: tx.status,
      method: tx.method,
      description: tx.description,
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
    const {
      userId,
      artistId,
      commissionId,
      totalAmount,
      artistAmount,
      platformFee,
    } = params;

    try {
      await prisma.$transaction(async (tx) => {
        const userWallet = await tx.wallet.findUnique({ where: { userId } });
        const artistWallet = await tx.wallet.findUnique({
          where: { userId: artistId },
        });

        if (!userWallet) throw new NotFoundError('User wallet not found');
        if (!artistWallet) throw new NotFoundError('Artist wallet not found');

        // Identify which wallet has the locked funds (support both old and new flow)
        let sourceWalletForLockedFunds = userWallet;
        if (artistWallet.lockedAmount >= totalAmount) {
          sourceWalletForLockedFunds = artistWallet;
        } else if (userWallet.lockedAmount < totalAmount) {
          throw new BadRequestError(
            'Insufficient locked funds in both user and artist wallets',
          );
        }

        // 1. Update Source Wallet (Deduct from lockedAmount)
        await tx.wallet.update({
          where: { id: sourceWalletForLockedFunds.id },
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
                update: {
                  earned: { increment: artistAmount },
                  netGain: { increment: artistAmount },
                },
                set: { earned: artistAmount, netGain: artistAmount, spent: 0 },
              },
            },
          } as unknown as Record<string, unknown>,
        });

        // 3. Create Transactions
        // Artist Credit
        await tx.transaction.create({
          data: {
            walletId: artistWallet.id,
            type: 'credited',
            category: TransactionCategory.COMMISSION,
            amount: artistAmount,
            method: 'art_coin',
            status: 'success',
            description: `Commission payment received for ${commissionId}`,
            meta: {
              commissionId,
              type: 'RELEASE',
              from:
                sourceWalletForLockedFunds.id === userWallet.id
                  ? 'USER_LOCKED'
                  : 'ARTIST_LOCKED',
            },
          },
        });

        const adminId = config.platform_admin_id;

        const adminWallet = await tx.wallet.upsert({
          where: { userId: adminId },
          create: { userId: adminId, balance: platformFee },
          update: { balance: { increment: platformFee } },
        });

        // Create Credit Transaction for Admin
        await tx.transaction.create({
          data: {
            walletId: adminWallet.id,
            type: 'credited',
            category: TransactionCategory.COMMISSION_FEE,
            amount: platformFee,
            method: 'art_coin',
            status: 'success',
            description: `Platform fee from commission ${commissionId}`,
            externalId: commissionId,
            meta: { buyerId: userId, artistId },
          },
        });

        // Log the fee deduction in User's history as a part of the COMMISSION expense
        await tx.transaction.create({
          data: {
            walletId: userWallet.id,
            type: 'debited',
            category: TransactionCategory.COMMISSION,
            amount: platformFee,
            method: 'art_coin',
            status: 'success',
            description: `Service fee for commission ${commissionId}`,
            meta: { commissionId, type: 'FEE' },
          },
        });
      });

      return true;
    } catch (error) {
      console.error('DistributeCommissionFunds failed:', error);
      return false;
    }
  }

  async lockCommissionFunds(
    userId: string,
    commissionId: string,
    amount: number,
  ): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({ where: { userId } });

        if (!wallet) throw new Error('Wallet not found');
        if (wallet.balance < amount) throw new Error('Insufficient funds');

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
            type: 'debited',
            category: TransactionCategory.COMMISSION,
            amount: amount,
            method: 'art_coin',
            status: 'success',
            description: `Funds locked for commission agreement ${commissionId}`,
            meta: { commissionId, type: 'LOCK' },
          },
        });
      });

      return true;
    } catch (error) {
      console.error('LockCommissionFunds failed:', error);
      return false;
    }
  }

  async refundCommissionFunds(
    userId: string,
    artistId: string,
    commissionId: string,
    amount: number,
  ): Promise<boolean> {
    try {
      await prisma.$transaction(async (tx) => {
        const userWallet = await tx.wallet.findUnique({ where: { userId } });
        const artistWallet = await tx.wallet.findUnique({
          where: { userId: artistId },
        });

        if (!userWallet) throw new NotFoundError('User wallet not found');
        if (!artistWallet) throw new NotFoundError('Artist wallet not found');

        // Identify where the locked funds are
        let sourceWalletForRefund = userWallet;
        if (artistWallet.lockedAmount >= amount) {
          sourceWalletForRefund = artistWallet;
        } else if (userWallet.lockedAmount < amount) {
          throw new BadRequestError(
            'Insufficient locked funds for refund in both user and artist wallets',
          );
        }

        // 1. Deduct from wherever it was locked
        await tx.wallet.update({
          where: { id: sourceWalletForRefund.id },
          data: {
            lockedAmount: { decrement: amount },
          },
        });

        // 2. Increment user balance (Refund)
        await tx.wallet.update({
          where: { userId },
          data: {
            balance: { increment: amount },
          },
        });

        // 3. Create transaction records
        await tx.transaction.create({
          data: {
            walletId: userWallet.id,
            type: 'credited',
            category: TransactionCategory.COMMISSION,
            amount: amount,
            method: 'art_coin',
            status: 'success',
            description: `Refund for commission dispute ${commissionId}`,
            meta: {
              commissionId,
              type: 'REFUND',
              from:
                sourceWalletForRefund.id === userWallet.id
                  ? 'USER_LOCKED'
                  : 'ARTIST_LOCKED',
            },
          },
        });
      });
      return true;
    } catch (error) {
      console.error('RefundCommissionFunds failed:', error);
      return false;
    }
  }

  // ==================================================================================
  // ADMIN WALLET MANAGEMENT METHODS (Merged from AdminWalletRepositoryImpl)
  // ==================================================================================

  async findAllWallets(
    page: number,
    limit: number,
    filters?: WalletFilters,
  ): Promise<{
    data: Wallet[];
    meta: { total: number; page: number; limit: number };
    stats?: {
      total: number;
      active: number;
      suspended: number;
      locked: number;
    };
  }> {
    const skip = (page - 1) * limit;

    const baseWhere: Prisma.WalletWhereInput = {
      userId: { not: config.platform_admin_id },
    };

    const where: Prisma.WalletWhereInput = { ...baseWhere };

    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.minBalance !== undefined) {
      where.balance = { ...(where.balance as object), gte: filters.minBalance };
    }
    if (filters?.maxBalance !== undefined) {
      where.balance = { ...(where.balance as object), lte: filters.maxBalance };
    }

    const total = await prisma.wallet.count({ where });

    const wallets = await prisma.wallet.findMany({
      where,
      skip,
      take: limit,
      orderBy: { updatedAt: 'desc' },
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
      locked,
    };

    return {
      data: wallets as Wallet[],
      stats,
      meta: { total, page, limit },
    };
  }

  async findWalletsByUserIds(
    userIds: string[],
    page: number,
    limit: number,
    filters?: WalletFilters,
  ): Promise<{
    data: Wallet[];
    meta: { total: number; page: number; limit: number };
    stats?: {
      total: number;
      active: number;
      suspended: number;
      locked: number;
    };
  }> {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.WalletWhereInput = {
      userId: { in: userIds },
    };
    if (filters?.status) {
      where.status = filters.status;
    }
    if (filters?.minBalance !== undefined) {
      where.balance = { ...(where.balance as object), gte: filters.minBalance };
    }
    if (filters?.maxBalance !== undefined) {
      where.balance = { ...(where.balance as object), lte: filters.maxBalance };
    }

    // Get total count
    const total = await prisma.wallet.count({ where });

    // Get wallets
    const wallets = await prisma.wallet.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    // Calculate global stats (ignoring view filters but excluding admin)
    const baseWhere: Prisma.WalletWhereInput = {
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
      locked,
    };

    return {
      data: wallets as Wallet[],
      stats,
      meta: { total, page, limit },
    };
  }

  async findWalletByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await prisma.wallet.findUnique({
      where: { userId },
    });

    if (!wallet) return null;

    return new Wallet(
      wallet.id,
      wallet.userId,
      wallet.balance,
      wallet.lockedAmount,
      wallet.status as 'active' | 'locked' | 'suspended',
      wallet.quickStats as Record<string, number> | null,
      wallet.transactionSummary as Record<string, number> | null,
    );
  }

  async updateWalletStatus(
    walletId: string,
    status: 'active' | 'locked' | 'suspended',
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
      updated.quickStats as Record<string, number> | null,
      updated.transactionSummary as Record<string, number> | null,
    );
  }

  async getTransactionsByWalletId(
    walletId: string,
    page: number,
    limit: number,
    filters?: TransactionFilters,
  ): Promise<{
    data: Transaction[];
    meta: { total: number; page: number; limit: number };
  }> {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.TransactionWhereInput = { walletId };
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
      (tx) =>
        new Transaction(
          tx.id,
          tx.walletId,
          tx.type as 'credited' | 'debited',
          tx.category as TransactionCategory,
          tx.amount,
          tx.method as 'stripe' | 'razorpay',
          tx.status as 'pending' | 'success' | 'failed',
          tx.externalId,
          tx.description,
          tx.meta as Record<string, unknown>,
          tx.createdAt,
          tx.updatedAt,
        ),
    );

    return {
      data,
      meta: { total, page, limit },
    };
  }
  async transferLockedCommissionFunds(params: {
    fromUserId: string;
    toUserId: string;
    commissionId: string;
    amount: number;
  }): Promise<boolean> {
    const { fromUserId, toUserId, commissionId, amount } = params;
    try {
      await prisma.$transaction(async (tx) => {
        const fromWallet = await tx.wallet.findUnique({
          where: { userId: fromUserId },
        });
        const toWallet = await tx.wallet.findUnique({
          where: { userId: toUserId },
        });

        if (!fromWallet) throw new NotFoundError('From wallet not found');
        if (!toWallet) throw new NotFoundError('To wallet not found');
        if (fromWallet.lockedAmount < amount)
          throw new BadRequestError('Insufficient locked funds for transfer');

        // 1. Update From Wallet (Deduct from lockedAmount)
        await tx.wallet.update({
          where: { userId: fromUserId },
          data: {
            lockedAmount: { decrement: amount },
          },
        });

        // 2. Update To Wallet (Add to lockedAmount)
        await tx.wallet.update({
          where: { userId: toUserId },
          data: {
            lockedAmount: { increment: amount },
          },
        });

        // 3. Create Transaction Record
        await tx.transaction.create({
          data: {
            walletId: fromWallet.id,
            type: 'debited',
            category: TransactionCategory.COMMISSION,
            amount: amount,
            method: 'art_coin',
            status: 'success',
            description: `Locked funds transferred to artist for delivery of commission ${commissionId}`,
            meta: {
              commissionId,
              type: 'TRANSFER_LOCKED',
              recipientId: toUserId,
            },
          },
        });

        await tx.transaction.create({
          data: {
            walletId: toWallet.id,
            type: 'credited',
            category: TransactionCategory.COMMISSION,
            amount: amount,
            method: 'art_coin',
            status: 'success',
            description: `Locked funds received for delivery of commission ${commissionId}`,
            meta: {
              commissionId,
              type: 'RECEIVE_LOCKED',
              senderId: fromUserId,
            },
          },
        });
      });
      return true;
    } catch (error) {
      console.error('TransferLockedCommissionFunds failed:', error);
      return false;
    }
  }
}
