import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useMyBids = () => {
  return useQuery({
    queryKey: ["my-bids"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/art/bids/my-bids");
      return Array.isArray(data) ? data : [];
    },
  });
};
