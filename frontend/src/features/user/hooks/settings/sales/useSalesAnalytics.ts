import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../../api/axios";

export const useSalesAnalytics = (range: string) => {
  return useQuery({
    queryKey: ["salesAnalytics", range],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/art/sales-analytics`, {
        params: { range },
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 2,
  });
};