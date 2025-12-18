import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { ROUTES } from "../../../../constants/routes";

interface CommissionStats {
  totalRequests: number;
  completedRequests: number;
  activeDisputes: number;
  inProgressRequests: number;
  totalRevenue: number;
  currentCommissionPercentage: number;
}

export const useCommissionStatsQuery = () => {
  return useQuery<CommissionStats>({
    queryKey: ['admin-commission-stats'],
    queryFn: async () => {
      const response = await apiClient.get(ROUTES.ADMIN.ADMIN_COMMISSION_STATS);
      return response.data.data;
    }
  });
};
