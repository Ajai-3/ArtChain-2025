import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../redux/store';
import type { AuctionCounts } from './useDashboardStats';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useAuctionStats = (timeRange: string = '7d') => {
  const { admin } = useSelector((state: RootState) => state.admin);

  return useQuery({
    queryKey: ['admin', 'auction-stats', timeRange],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: AuctionCounts }>(
        API_ENDPOINTS.ART_ADMIN_AUCTIONS_STATS,
        { params: { timeRange } }
      );
      return data.data;
    },
    enabled: !!admin,
    staleTime: 5 * 60 * 1000,
  });
};
