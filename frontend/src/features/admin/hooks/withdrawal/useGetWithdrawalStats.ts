import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetWithdrawalStats = () => {
  return useQuery({
    queryKey: ["admin", "withdrawalStats"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.WALLET_ADMIN_WITHDRAWAL_STATS);
      return response.data.data;
    },
    enabled: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
};
