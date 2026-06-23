export interface TransactionItem {
  amount: number;
  category: string;
  description: string;
  createdAt: Date;
  id?: string;
  userId?: string;
  type?: string;
  status?: string;
}

export interface TransactionStats {
  totalAmount: number;
  transactionCount: number;
  byCategory: Record<string, number>;
}

export interface RevenueStats {
  totalRevenue: number;
  period: string;
  chartData?: Array<{ date: string; revenue: number }>;
  breakdown: {
    subscriptions?: number;
    artSales?: number;
    auctions?: { amount: number; count: number };
    commissions?: { amount: number; count: number };
  };
}

export interface WalletQueryParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
  page?: number;
}