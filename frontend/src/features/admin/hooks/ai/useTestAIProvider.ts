import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

export const useTestAIProvider = () => {
  return useMutation({
    mutationFn: (provider: string) => apiClient.post("/api/v1/art/admin/ai/test-provider", { provider }),
    onSuccess: (data: any) => {
      if (data.data.isConnected) {
        toast.success("Provider connected successfully");
      } else {
        toast.error("Provider connection failed");
      }
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Test failed");
    },
  });
};
