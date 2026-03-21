import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../../api/axios";

export const useSalesHistory = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["salesHistory", page, limit],
    queryFn: async () => {
      const { data } = await apiClient.get(`/api/v1/art/saled`, {
        params: { page, limit },
      });
      return data.data;
    },
    // History records don't change often, keep for 5 minutes
    staleTime: 1000 * 60 * 5,
  });
};