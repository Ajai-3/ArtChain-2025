import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../redux/store';
import type { TransactionVolume } from './useDashboardStats';

export const useTransactionStats = (timeRange: string = '7d') => {
  const { admin } = useSelector((state: RootState) => state.admin);

  return useQuery({
    queryKey: ['admin', 'transaction-stats', timeRange],
    queryFn: async () => {
      const { data } = await apiClient.get<{ success: boolean; data: TransactionVolume[] }>(
        '/api/v1/wallet/admin/transactions/stats', 
        { params: { timeRange } }
      );
      return data.data;
    },
    enabled: !!admin,
    staleTime: 5 * 60 * 1000,
  });
};
