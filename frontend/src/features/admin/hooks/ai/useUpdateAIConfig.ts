import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

export const useUpdateAIConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.put("/api/v1/art/admin/ai/config", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ai-configs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-ai-analytics"] });
      toast.success("AI configuration updated successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update configuration");
    },
  });
};
