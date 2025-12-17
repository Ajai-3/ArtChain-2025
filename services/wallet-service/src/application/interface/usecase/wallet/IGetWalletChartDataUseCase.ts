export interface WalletChartData {
  trend: { date: string; amount: number; value: number; income: number; expense: number }[]; 
  breakdown: {
    earned: { name: string; value: number }[];
    spent: { name: string; value: number }[];
  };
  stats: { name: string; value: number | string }[];
}

export interface IGetWalletChartDataUseCase {
  execute(userId: string, timeRange: "7d" | "1m" | "all"): Promise<WalletChartData>;
}
