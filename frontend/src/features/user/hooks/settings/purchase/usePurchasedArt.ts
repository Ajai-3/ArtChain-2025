import { useQuery, keepPreviousData } from '@tanstack/react-query';
import apiClient from '../../../../../api/axios';
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";

export const usePurchasedArt = (page: number, limit: number) => {
  return useQuery({
    queryKey: ['purchasedArt', page, limit],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ART_PURCHASED, {
        params: { page, limit }
      });
      
      return response.data.data?.purchases || [];
    },
    placeholderData: keepPreviousData, 
    staleTime: 5000, 
  });
};