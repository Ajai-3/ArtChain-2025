import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

interface UpdateReportStatusParams {
  reportId: string;
  status: "resolved" | "dismissed";
}

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status }: UpdateReportStatusParams) => {
      const response = await apiClient.patch(`/api/v1/admin/reports/${reportId}/status`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Report status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update report status");
    },
  });
};
