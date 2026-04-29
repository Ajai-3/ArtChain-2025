import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

export const useTestAIProvider = () => {
  return useMutation({
    mutationFn: (provider: string) => apiClient.post("/api/v1/art/admin/ai/test-provider", { provider }),
    onSuccess: (data: { data: { isConnected: boolean } }) => {
      if (data.data.isConnected) {
        toast.success("Provider connected successfully");
      } else {
        toast.error("Provider connection failed");
      }
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error?.response?.data?.message || "Test failed");
    },
  });
};
