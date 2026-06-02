import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useUpdateArtStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiClient.patch(API_ENDPOINTS.ART_ADMIN_ART_1(id), {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-arts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-art-stats"] });
      toast.success("Art status updated successfully");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to update status");
    },
  });
};
