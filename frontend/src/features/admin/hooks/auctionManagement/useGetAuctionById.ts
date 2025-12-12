import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetAuctionById = (id: string | null) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get(`/api/v1/art/admin/auctions/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};
