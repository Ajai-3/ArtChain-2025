import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../../api/axios";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";

export const useSalesAnalytics = (range: string) => {
  return useQuery({
    queryKey: ["salesAnalytics", range],
    queryFn: async () => {
      const { data } = await apiClient.get(API_ENDPOINTS.ART_SALESANALYTICS, {
        params: { range },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};