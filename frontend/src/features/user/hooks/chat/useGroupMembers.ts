import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGroupMembers = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ["groupMembers", conversationId],
    queryFn: async ({ pageParam }) => {
      const res = await apiClient.get(
        `/api/v1/chat/conversation/${conversationId}/members?page=${pageParam}&limit=20`
      );
      return res.data.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: any) => lastPage.nextPage,
    enabled: !!conversationId,
  });
};
