import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

interface GroupMembersResponse {
  members: { id: string; name: string; username: string; profileImage?: string; role?: string }[];
  nextPage: number | null;
}

export const useGroupMembers = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ["groupMembers", conversationId],
    queryFn: async ({ pageParam }) => {
      const res = await apiClient.get(
        `/api/v1/chat/conversation/${conversationId}/members?page=${pageParam}&limit=20`
      );
      return res.data.data as GroupMembersResponse;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: GroupMembersResponse) => lastPage.nextPage,
    enabled: !!conversationId,
  });
};
