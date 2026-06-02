import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useMyBids = (status?: string) => {
  return useQuery({
    queryKey: ["my-bids", status],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ART_MYBIDDINGHISTORY, {
        params: { status: status === "ALL" ? undefined : status }
      });
      return Array.isArray(res.data.data) ? res.data.data : [];
    },
    placeholderData: keepPreviousData,
  });
};