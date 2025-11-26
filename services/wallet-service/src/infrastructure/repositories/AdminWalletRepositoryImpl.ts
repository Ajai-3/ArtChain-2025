import { prisma } from "../db/prisma";
import { injectable } from "inversify";
import { 
  IAdminWalletRepository, 
  WalletFilters, 
  TransactionFilters 
} from "../../domain/repository/IAdminWalletRepository";
import { Wallet } from "../../domain/entities/Wallet";
import { Transaction } from "../../domain/entities/Transaction";

@injectable()
export class AdminWalletRepositoryImpl implements IAdminWalletRepository {
  async findAllWallets(
    page: number,
    limit: number,
    filters?: WalletFilters
  ): Promise<{ data: any[]; meta: { total: number; page: number; limit: number } }> {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
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
      meta: { total, page, limit },
    };
  }

  async findWalletsByUserIds(
    userIds: string[],
    page: number,
    limit: number,
    filters?: WalletFilters
  ): Promise<{ data: any[]; meta: { total: number; page: number; limit: number } }> {
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
    filters?: TransactionFilters
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
