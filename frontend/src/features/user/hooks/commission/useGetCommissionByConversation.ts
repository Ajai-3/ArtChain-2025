import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetCommissionByConversation = (conversationId: string) => {
  return useQuery({
    queryKey: ["commission", conversationId],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ART_COMMISSION_CONVERSATION(conversationId));
      return response.data.data;
    },
    enabled: !!conversationId,
    refetchInterval: 5000,
  });
};
