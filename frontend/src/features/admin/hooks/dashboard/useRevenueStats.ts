import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../redux/store';

interface RevenueStats {
  totalRevenue: number;
  revenueBySource: {
    auctions: number;
    artSales: number;
    commissions: number;
  };
  revenueByDate: Record<string, number>;
}

export const useRevenueStats = (timeRange: string = '7d') => {
  const { admin } = useSelector((state: RootState) => state.admin);

  const { data: stats, isLoading: loading, error, refetch } = useQuery<RevenueStats>({
    queryKey: ['admin', 'revenue-stats', timeRange],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: RevenueStats }>(
        `/api/v1/admin/revenue-stats?timeRange=${timeRange}`
      );
      return response.data.data;
    },
    enabled: !!admin,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    stats: stats || null,
    loading,
    error: error ? (error as Error).message : null,
    refetch,
  };
};
