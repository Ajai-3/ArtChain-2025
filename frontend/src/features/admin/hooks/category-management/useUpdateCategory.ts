import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

interface UpdateCategoryData {
  _id: string;
  name?: string;
  count?: number;
  status?: "active" | "inactive";
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateCategoryData) => {
      const res = await apiClient.patch(`/api/v1/art/category/${data._id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      const updatedCategory = data.category;

      const allCategoryQueries = queryClient.getQueriesData({ queryKey: ["categories"] });

      allCategoryQueries.forEach(([key]: [string[], unknown]) => {
        queryClient.setQueryData(key, (old: { data?: Array<{ _id: string }> } | undefined) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data?.map((cat) =>
              cat._id === updatedCategory._id ? updatedCategory : cat
            ),
          };
        });
      });

      toast.success(data.message || "Category updated successfully");
    },
    onError: (err: Error) => {
      toast.error(err?.message || "Failed to update category");
    },
  });
};
