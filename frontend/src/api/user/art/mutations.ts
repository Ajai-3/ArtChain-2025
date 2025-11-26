import apiClient from "../../axios";
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateArtworkMutation = () => {
  return useMutation({
    mutationFn: (payload: any) =>
      apiClient.post("/api/v1/art", payload),
    onSuccess: (data) => {
      console.log("Artwork created:", data);
      toast.success("Artwork created successfully");
    },
    onError: (error) => {
      console.error("Artwork creation failed:", error);
    },
  });
};

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

export const useDeleteCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) =>
      apiClient.delete(`/api/v1/art/comments/${commentId}`),
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