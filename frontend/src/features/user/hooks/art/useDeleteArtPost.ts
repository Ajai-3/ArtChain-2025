import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useDeleteArtPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(API_ENDPOINTS.ART_2(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allArt"] });
      queryClient.invalidateQueries({ queryKey: ["artByName"] });
      toast.success("Art post deleted successfully");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to delete art post");
    },
  });
};
