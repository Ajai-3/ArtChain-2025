import { useQuery, keepPreviousData } from '@tanstack/react-query';
import apiClient from '../../../../../api/axios';

export const usePurchasedArt = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['purchasedArt', page, limit],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/art/purchased', {
        params: { page, limit }
      });
      
      return response.data.data;
    },
    placeholderData: keepPreviousData, 
    staleTime: 5000, 
  });
};