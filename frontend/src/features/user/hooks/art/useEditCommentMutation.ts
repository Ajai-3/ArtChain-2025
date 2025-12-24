import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useEditCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      apiClient.put(`/api/v1/art/comments/${commentId}`, { content }),
    onSuccess: (data, variables) => {
      toast.success("Comment edited successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Edit comment failed:", error);
      toast.error("Failed to edit comment");
    },
  });
};
