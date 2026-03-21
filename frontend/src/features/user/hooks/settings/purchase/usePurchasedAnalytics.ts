import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../../api/axios';

export const usePurchasedAnalytics = (range: string) => {
  return useQuery({
    queryKey: ['purchasedAnalytics', range],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/art/purchase-analytics', {
        params: { range }
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};