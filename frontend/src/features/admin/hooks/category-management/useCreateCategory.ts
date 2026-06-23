import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface CategoryData {
  name: string;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryData) => {
      const res = await apiClient.post(API_ENDPOINTS.ART_CATEGORY, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast.success(data.message || "Category created successfully");
    },
    onError: (err: { message?: string }) => {
      toast.error(
        err?.message || "Failed to create category. Try again."
      );
    },
  });
};
