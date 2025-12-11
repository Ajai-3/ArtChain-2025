import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useAuctionById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["auction", id],
    queryFn: async () => {
      if (!id) throw new Error("Auction ID is required");
      const { data } = await apiClient.get(`/api/v1/art/auctions/${id}`);
      return data?.data || data; // Handle { message, data: { ... } } structure
    },
    enabled: !!id,
    staleTime: 0, // Ensure fresh data for detail page
  });
};
