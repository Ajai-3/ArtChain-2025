import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetWithdrawalStats = () => {
  return useQuery({
    queryKey: ["admin", "withdrawalStats"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/wallet/admin/withdrawal/stats");
      return response.data.data;
    },
    enabled: true,
    refetchOnMount: true,
    staleTime: 1000 * 60 * 5,
  });
};
