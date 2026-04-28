export interface RevenueBreakdownItem {
  amount: number;
  count: number;
}

export interface RevenueBreakdown {
  auctions: RevenueBreakdownItem;
  artSales: RevenueBreakdownItem;
  commissions: RevenueBreakdownItem;
}

export interface RevenueTrendItem {
  date: string;
  amount: number;
}

export interface RevenueStatsResponse {
  overallTotalRevenue: number;
  overallBreakdown: RevenueBreakdown;
  trendTotalRevenue: number;
  trendBreakdown: RevenueBreakdown;
  trendData: RevenueTrendItem[];
}