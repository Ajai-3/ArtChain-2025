import { useQuery, keepPreviousData } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface AuctionResponse {
  data: {
    auctions: Array<{
      id: string;
      title: string;
      status: string;
      currentBid: number;
      host?: { username: string };
    }>;
    total: number;
    stats?: {
      active: number;
      ended: number;
      sold: number;
      unsold: number;
    };
  };
}

interface Filters {
  status?: string;
  search?: string;
  hostId?: string;
  startDate?: string;
  endDate?: string;
}

export const useGetAllAuctions = (
  page: number,
  limit: number,
  filters?: Filters,
) => {
  return useQuery<AuctionResponse>({
    queryKey: ['admin-auctions', page, limit, filters],
    queryFn: async () => {
      const params: Record<string, string | number | undefined> = {
        page,
        limit,
        ...filters,
      };

      if (
        typeof params.status === 'string' &&
        params.status.toLowerCase() === 'all'
      ) {
        params.status = 'ALL';
      }

      const response = await apiClient.get(API_ENDPOINTS.ART_ADMIN_AUCTIONS_1, {
        params,
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
