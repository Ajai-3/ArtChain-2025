import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useDeleteCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      apiClient.delete(API_ENDPOINTS.ART_COMMENTS(commentId)),
    onSuccess: () => {
      toast.success("Comment deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
    },
    onError: (error) => {
      console.error("Delete comment failed:", error);
      toast.error("Failed to delete comment");
    },
  });
};
