import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useAuctions = (filterStatus: string = 'ALL', startDate: string = '', endDate: string = '') => {
  return useQuery({
    queryKey: ["auctions", filterStatus, startDate, endDate],
    queryFn: async () => {
      // Build query string
      const params = new URLSearchParams();
      if (filterStatus) params.append("status", filterStatus);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      const { data } = await apiClient.get(`/api/v1/art/auctions?${params.toString()}`);
      if (data && Array.isArray(data.data)) {
        return data.data;
      }
      return Array.isArray(data) ? data : (data.auctions || []);
    },
    staleTime: 60000, 
    refetchOnWindowFocus: false,
  });
};
