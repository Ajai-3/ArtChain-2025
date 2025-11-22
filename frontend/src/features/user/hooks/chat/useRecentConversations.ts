import apiClient from "../../../../api/axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useRecentConversations = () => {
  return useInfiniteQuery({
    queryKey: ["recentConversations"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get(
        `/api/v1/chat/conversation/recent?page=${pageParam}`
      );

      return res.data.data;
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
