import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface GetAllWithdrawalRequestsParams {
  page: number;
  limit?: number;
  status?: string;
}

export const useGetAllWithdrawalRequests = ({
  page,
  limit = 6,
  status,
}: GetAllWithdrawalRequestsParams) => {
  return useQuery({
    queryKey: ['admin', 'withdrawalRequests', page, limit, status],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit };

      // Only add status if it's not "ALL"
      if (status && status !== 'ALL') {
        params.status = status;
      }

      const response = await apiClient.get(
        API_ENDPOINTS.WALLET_ADMIN_WITHDRAWAL_REQUESTS_1,
        {
          params,
        },
      );

      return response.data.data;
    },
    enabled: true,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0 // Always fetch fresh data when filter changes
  });
};
