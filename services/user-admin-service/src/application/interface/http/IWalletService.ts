export interface IWalletService {
  getAdminTransactions(
    adminId: string,
    token: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<{
    transactions: Array<{
      amount: number;
      category: string;
      description: string;
      createdAt: Date;
    }>;
  }>;
  getRecentTransactions(token: string, limit?: number): Promise<any[]>;
  getTransactionStats(token: string): Promise<any[]>;
  getRevenueStats(
    adminId: string,
    token: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<any>;
}
