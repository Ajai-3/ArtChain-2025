import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGroupActions = (conversationId: string) => {
  const queryClient = useQueryClient();

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(API_ENDPOINTS.CHAT_CONVERSATION(conversationId, userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    },
  });

  const addAdmin = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.post(API_ENDPOINTS.CHAT_CONVERSATION_1(conversationId, userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    },
  });

  const removeAdmin = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(API_ENDPOINTS.CHAT_CONVERSATION_2(conversationId, userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    },
  });

  const addMember = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.post(API_ENDPOINTS.CHAT_CONVERSATION_3(conversationId, userId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    },
  });

  return { removeMember, addAdmin, removeAdmin, addMember };
};
