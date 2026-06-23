import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetAuctionById = (id: string | null) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get(API_ENDPOINTS.ART_ADMIN_AUCTIONS_2(id));
      return response.data.data;
    },
    enabled: !!id,
  });
};
