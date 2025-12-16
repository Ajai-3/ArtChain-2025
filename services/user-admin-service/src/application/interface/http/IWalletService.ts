export interface IWalletService {
  getAdminTransactions(
    adminId: string,
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
}
