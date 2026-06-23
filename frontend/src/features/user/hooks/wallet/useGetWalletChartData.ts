import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export interface WalletChartData {
  trend: { date: string; amount: number; value: number; income: number; expense: number }[];
  breakdown: {
    earned: { name: string; value: number }[];
    spent: { name: string; value: number }[];
  };
  stats: { name: string; value: number | string }[];
}

export const useGetWalletChartData = (timeRange: "7d" | "1m" | "all") => {
  return useQuery({
    queryKey: ["walletChartData", timeRange],
    queryFn: async () => {
      const response = await apiClient.get<{ message: string; data: WalletChartData }>(
        API_ENDPOINTS.WALLET_STATS_CHARTTIMERANGE(timeRange)
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, 
  });
};
