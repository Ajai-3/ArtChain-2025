import apiClient from "../../../../api/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useRecentConversations = () => {
  return useInfiniteQuery({
    queryKey: ["recentConversations"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get(
        API_ENDPOINTS.CHAT_CONVERSATION_RECENTPAGE(pageParam)
      );

      return res.data.data;
    },
    getNextPageParam: (lastPage) => lastPage?.nextPage ?? undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
