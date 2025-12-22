import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

interface GetAllWithdrawalRequestsParams {
  page: number;
  limit?: number;
  status?: string;
}

export const useGetAllWithdrawalRequests = ({ page, limit = 6, status }: GetAllWithdrawalRequestsParams) => {
  return useQuery({
    queryKey: ["admin", "withdrawalRequests", page, limit, status],
    queryFn: async () => {
      const params: any = { page, limit };
      
      // Only add status if it's not "ALL"
      if (status && status !== "ALL") {
        params.status = status;
      }
      
      console.log("🔍 Fetching withdrawals with params:", params);
      
      const response = await apiClient.get("/api/v1/wallet/admin/withdrawal/requests", {
        params,
      });
      
      console.log("✅ Received data:", response.data.data);
      
      return response.data.data;
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0, // Always fetch fresh data when filter changes
  });
};
