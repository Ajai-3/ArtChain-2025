import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useMyBids = (status?: string) => {
  return useQuery({
    queryKey: ["my-bids", status],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/art/my-bidding-history", {
        params: { status: status === "ALL" ? undefined : status }
      });
      return Array.isArray(res.data.data) ? res.data.data : [];
    },
  });
};