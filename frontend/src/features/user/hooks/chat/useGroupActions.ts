import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGroupActions = (conversationId: string) => {
  const queryClient = useQueryClient();

  const removeMember = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/api/v1/chat/conversation/${conversationId}/member/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    },
  });

  const addAdmin = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.post(`/api/v1/chat/conversation/${conversationId}/admin/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    },
  });

  const removeAdmin = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/api/v1/chat/conversation/${conversationId}/admin/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    },
  });

  const addMember = useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.post(`/api/v1/chat/conversation/${conversationId}/member/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groupMembers", conversationId] });
    },
  });

  return { removeMember, addAdmin, removeAdmin, addMember };
};
