import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useUnifiedSearch = (query: string, type: "user" | "art" | "all") => {
  return useQuery({
    queryKey: ["search", query, type],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(
        API_ENDPOINTS.ELASTIC_SEARCHQ(encodeURIComponent(query), type),
        { signal }
      );
      return res.data; 
    },
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
