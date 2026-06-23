export interface RevenueStatsResponse {
  totalRevenue: number;
  revenueBySource: RevenueSourceBreakdown;
  revenueByDate: Record<string, number>;
}

export interface RevenueStatsInternal {
  totalRevenue: number;
  chartData?: Array<{ date: string; revenue: number }>;
  breakdown?: {
    auctions?: { amount: number; count: number };
    artSales?: { amount: number; count: number };
    commissions?: { amount: number; count: number };
  };
}

export interface RevenueSourceBreakdown {
  auctions: RevenueAmount;
  artSales: RevenueAmount;
  commissions: RevenueAmount;
}

export interface RevenueAmount {
  amount: number;
  count: number;
}
