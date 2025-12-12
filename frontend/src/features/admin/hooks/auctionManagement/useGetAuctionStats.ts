import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetAuctionStats = () => {
  return useQuery({
    queryKey: ["admin-auction-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/art/admin/auctions/stats");
      return response.data;
    },
  });
};
