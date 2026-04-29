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
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      console.error("Delete error:", err);
      toast.error(err?.response?.data?.message || "Failed to delete generation");
    },
  });
};
