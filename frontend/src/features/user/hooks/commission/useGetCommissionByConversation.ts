import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetCommissionByConversation = (conversationId: string) => {
  return useQuery({
    queryKey: ["commission", conversationId],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/art/commission/conversation/${conversationId}`);
      return response.data.data;
    },
    enabled: !!conversationId,
  });
};
