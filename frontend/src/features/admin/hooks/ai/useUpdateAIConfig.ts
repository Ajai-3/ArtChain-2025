import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

export const useUpdateAIConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { provider: string } & Record<string, unknown>) => apiClient.put("/api/v1/art/admin/ai/config", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-ai-configs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-ai-analytics"] });
      toast.success("AI configuration updated successfully");
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Failed to update configuration");
    },
  });
};
