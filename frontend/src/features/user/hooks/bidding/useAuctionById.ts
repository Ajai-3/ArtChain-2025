import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useAuctionById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: async () => {
      if (!id) throw new Error("Auction ID is required");
      const { data } = await apiClient.get(API_ENDPOINTS.ART_AUCTIONS(id));
      return data?.data || data;
    },
    enabled: !!id,
    staleTime: 0,
  });
};
