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

export const useBuyArtMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artId: string) => apiClient.post(`/api/v1/art/buy/${artId}`),
    onSuccess: (data, artId) => {
      toast.success("Art purchased successfully!");
      queryClient.invalidateQueries({ queryKey: ["art", artId] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: (error: any) => {
      console.error("Buy art failed:", error);
      toast.error(error.response?.data?.message || "Failed to buy art");
    },
  });
};

export const useDownloadArtMutation = () => {
  return useMutation({
    mutationFn: (artId: string) => apiClient.get(`/api/v1/art/download/${artId}`),
    onSuccess: (data) => {
      const { downloadUrl } = data.data;
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
    },
    onError: (error: any) => {
      console.error("Download art failed:", error);
      toast.error(error.response?.data?.message || "Failed to download art");
    },
  });
};