import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useDeleteAIGeneration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (generationId: string) => {
      await apiClient.delete(`/api/v1/art/ai/generations/${generationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-ai-generations"] });
      toast.success("Image generated deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete generation");
    },
  });
};
