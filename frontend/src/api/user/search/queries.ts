import apiClient from "../../axios";
import type { IndexedUser } from "../../../types/user/IndexedUser";
import { useQuery } from "@tanstack/react-query";

export const useSearchUsers = (query: string) => {
  return useQuery<IndexedUser[]>({
    queryKey: ["searchUsers", query],
    queryFn: async ({ signal }): Promise<IndexedUser[]> => {
      const res = await apiClient.get(
        `/api/v1/elastic-user/search?q=${encodeURIComponent(query)}`,
        { signal }
      );
      return res.data as any;
    },
    enabled: query.trim().length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
