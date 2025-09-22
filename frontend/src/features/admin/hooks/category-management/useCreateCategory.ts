import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

interface CategoryData {
  name: string;
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CategoryData) => {
      const res = await apiClient.post("/api/v1/art/category", data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });

      toast.success(data.message || "Category created successfully");
    },
    onError: (err: any) => {
      toast.error(
        err?.message || "Failed to create category. Try again."
      );
    },
  });
};
