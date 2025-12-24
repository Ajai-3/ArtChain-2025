import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../redux/store';
import type { CommissionCounts } from './useDashboardStats';

export const useCommissionStats = (timeRange: string = '7d') => {
  const { admin } = useSelector((state: RootState) => state.admin);

  return useQuery({
    queryKey: ['admin', 'commission-stats', timeRange],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: CommissionCounts }>(
        '/api/v1/art/admin/commissions/stats',
        { params: { timeRange } }
      );
      return data.data;
    },
    enabled: !!admin,
    staleTime: 5 * 60 * 1000,
  });
};
