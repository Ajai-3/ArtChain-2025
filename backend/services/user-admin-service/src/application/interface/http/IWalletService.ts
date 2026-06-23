import { TransactionItem, TransactionStats } from '../../../types/wallet.types';

export interface IWalletService {
  getAdminTransactions(
    adminId: string,
    token: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    transactions: TransactionItem[];
  }>;
  getRecentTransactions(token: string, limit?: number): Promise<TransactionItem[]>;
  getTransactionStats(token: string): Promise<TransactionStats>;
  getRevenueStats(
    adminId: string,
    token: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, unknown> | null>;
}
