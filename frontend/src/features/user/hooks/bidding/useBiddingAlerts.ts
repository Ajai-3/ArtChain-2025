import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useBiddingAlerts = () => {
  return useQuery({
    queryKey: ["biddingAlerts"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/art/auctions/counts");
      
      const activeCount = data.data.active || 0;
      const scheduledCount = data.data.scheduled || 0;

      return {
        activeCount: activeCount,
        scheduledCount: scheduledCount > 10 ? 10 : scheduledCount,
      };
    },
    staleTime: 30000,
    refetchInterval: 60000,
  });
};
