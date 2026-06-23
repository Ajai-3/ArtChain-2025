import { Wallet } from '../entities/Wallet';
import { Transaction } from '../entities/Transaction';
import { IBaseRepository } from './IBaseRepository.js';
import { RevenueStatsResponse } from '../../types/Revenue';
import { DailyTransactionStat } from '../../types/TransactionStats';
import { WalletMeta, WalletStats } from '../../types/WalletAdmin';
import { Prisma } from '@prisma/client';

export interface WalletFilters {
  status?: 'active' | 'locked' | 'suspended';
  minBalance?: number;
  maxBalance?: number;
}

export interface TransactionFilters {
  type?: 'credited' | 'debited';
  category?: 'TOP_UP' | 'SALE' | 'PURCHASE' | 'WITHDRAWAL' | 'COMMISSION' | 'REFUND' | 'OTHER';
  status?: 'pending' | 'success' | 'failed';
  startDate?: Date;
  endDate?: Date;
}

export interface TransactionStats {
  earned: number;
  spent: number;
  avgTransaction: number;
}

export interface RecentTransaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  category: string;
  status: string;
  method: string;
  description: string | null;
}

export interface AdminTransaction {
  id: string;
  walletId: string;
  type: string;
  category: string;
  amount: number;
  method: string;
  status: string;
  externalId: string | null;
  description: string;
  meta: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWalletRepository extends IBaseRepository<Wallet> {
  getByUserId(userId: string): Promise<Wallet | null>;
  getTransactionStats(walletId: string): Promise<TransactionStats>;
  getRecentTransactions(walletId: string, limit: number): Promise<RecentTransaction[]>;
  getTransactionsWithFilter(walletId: string, timeRange?: '7d' | '1m' | 'all'): Promise<RecentTransaction[]>;
  getDailyStats(walletId: string, startDate?: Date): Promise<DailyTransactionStat[]>;
  getCategoryStats(walletId: string, startDate?: Date): Promise<{ type: string; category: string; _sum: { amount: number } }[]>;
  lockAmount(userId: string, amount: number): Promise<boolean>;
  unlockAmount(userId: string, amount: number): Promise<boolean>;
  settleAuctionFunds(winnerId: string, sellerId: string, adminId: string, totalAmount: number, commissionAmount: number, auctionId: string): Promise<boolean>;
  processSplitPurchase(buyerId: string, sellerId: string, adminId: string, totalAmount: number, commissionAmount: number, artId: string): Promise<boolean>;
  transferFunds(fromId: string, toId: string, amount: number, description: string, referenceId: string, category: string): Promise<boolean>;
  getRevenueStats(adminId: string, startDate?: Date, endDate?: Date): Promise<RevenueStatsResponse>;
  getAdminTransactions(adminId: string, startDate?: Date, endDate?: Date): Promise<AdminTransaction[]>;
  getAdminCommissionTransactions(walletId: string, startDate?: Date, endDate?: Date): Promise<AdminTransaction[]>;
  getAllRecentTransactions(limit: number): Promise<RecentTransaction[]>;
  
  // Commission specific methods
  distributeCommissionFunds(params: {
    userId: string;
    artistId: string;
    commissionId: string;
    totalAmount: number;
    artistAmount: number;
    platformFee: number;
  }): Promise<boolean>;
  
  lockCommissionFunds(userId: string, commissionId: string, amount: number): Promise<boolean>;
  
  refundCommissionFunds(userId: string, artistId: string, commissionId: string, amount: number): Promise<boolean>;

  transferLockedCommissionFunds(params: {
    fromUserId: string;
    toUserId: string;
    commissionId: string;
    amount: number;
  }): Promise<boolean>;

  // Admin wallet management methods (merged from IAdminWalletRepository)
  findAllWallets(
    page: number,
    limit: number,
    filters?: WalletFilters
  ): Promise<{
    data: Wallet[];
    meta: WalletMeta;
    stats?: WalletStats;
  }>;

  findWalletsByUserIds(
    userIds: string[],
    page: number,
    limit: number,
    filters?: WalletFilters
  ): Promise<{
    data: Wallet[];
    meta: WalletMeta;
    stats?: WalletStats;
  }>;

  findWalletByUserId(userId: string): Promise<Wallet | null>;

  updateWalletStatus(
    walletId: string,
    status: 'active' | 'locked' | 'suspended'
  ): Promise<Wallet>;

  getTransactionsByWalletId(
    walletId: string,
    page: number,
    limit: number,
    filters?: TransactionFilters
  ): Promise<{ data: Transaction[]; meta: { total: number; page: number; limit: number } }>;
}