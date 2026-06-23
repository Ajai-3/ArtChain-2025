export interface PlatformRevenueStatsResponse {
  totalRevenue: number;
  period: string;
  chartData: RevenueChartItemResponse[];
}

export interface RevenueChartItemResponse {
  date: string;
  amount: number;
}