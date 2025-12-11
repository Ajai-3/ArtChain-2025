import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useAuctions = (filterStatus: string = 'ALL', startDate: string = '', endDate: string = '', hostId?: string) => {
  return useInfiniteQuery({
    queryKey: ["auctions", filterStatus, startDate, endDate, hostId],
    queryFn: async ({ pageParam = 1 }) => {
      // Build query string
      const params = new URLSearchParams();
      params.append("page", pageParam.toString());
      params.append("limit", "10"); 
      
      if (filterStatus) params.append("status", filterStatus);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (hostId) params.append("hostId", hostId);

      const { data } = await apiClient.get(`/api/v1/art/auctions?${params.toString()}`);
      
      // Response structure should be { message: "...", data: { auctions: [], total: number } }
      // Or fallback if extraction logic is robust
      if (data && data.data && Array.isArray(data.data.auctions)) {
          return {
              auctions: data.data.auctions,
              total: data.data.total,
              nextPage: (data.data.auctions.length === 10) ? pageParam + 1 : undefined 
          };
      }
      
      // Fallback for old structure or unexpected errors
      const auctions = Array.isArray(data.data) ? data.data : [];
      return {
          auctions: auctions,
          total: auctions.length,
          nextPage: (auctions.length === 10) ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    staleTime: 60000, 
    refetchOnWindowFocus: false,
  });
};
