import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useUnifiedSearch = (query: string, type: "user" | "art" | "all") => {
  return useQuery({
    queryKey: ["search", query, type],
    queryFn: async ({ signal }) => {
      const res = await apiClient.get(
        `/api/v1/elastic/search?q=${encodeURIComponent(query)}&type=${type}`,
        { signal }
      );
      return res.data; 
    },
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
