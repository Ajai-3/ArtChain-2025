import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface GroupMembersResponse {
  members: { id: string; name: string; username: string; profileImage?: string; role?: string }[];
  nextPage: number | null;
}

export const useGroupMembers = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ["groupMembers", conversationId],
    queryFn: async ({ pageParam }) => {
      const res = await apiClient.get(
        API_ENDPOINTS.CHAT_CONVERSATION_4(conversationId, pageParam)
      );
      return res.data.data as GroupMembersResponse;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage: GroupMembersResponse) => lastPage.nextPage,
    enabled: !!conversationId,
  });
};
