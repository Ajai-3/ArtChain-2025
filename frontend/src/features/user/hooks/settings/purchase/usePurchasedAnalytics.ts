import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../../api/axios';
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";

export const usePurchasedAnalytics = (range: string) => {
  return useQuery({
    queryKey: ['purchasedAnalytics', range],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ART_PURCHASEANALYTICS, {
        params: { range }
      });

      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};