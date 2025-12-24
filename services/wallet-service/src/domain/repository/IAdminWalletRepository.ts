import { Wallet } from "../entities/Wallet";
import { Transaction } from "../entities/Transaction";

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

export interface IAdminWalletRepository {
  findAllWallets(
    page: number,
    limit: number,
    filters?: WalletFilters
  ): Promise<{ 
    data: any[]; 
    meta: { total: number; page: number; limit: number };
    stats?: {
      total: number;
      active: number;
      suspended: number;
      locked: number;
    }
  }>;

  findWalletsByUserIds(
    userIds: string[],
    page: number,
    limit: number,
    filters?: WalletFilters
  ): Promise<{ data: any[]; meta: { total: number; page: number; limit: number } }>;

  findWalletByUserId(userId: string): Promise<any | null>;

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
