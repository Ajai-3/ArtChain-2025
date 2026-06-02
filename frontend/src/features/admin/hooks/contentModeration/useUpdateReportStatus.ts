import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface UpdateReportStatusParams {
  reportId: string;
  status: "resolved" | "dismissed";
}

export const useUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ reportId, status }: UpdateReportStatusParams) => {
      const response = await apiClient.patch(API_ENDPOINTS.ADMIN_REPORTS_1(reportId), {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success("Report status updated successfully");
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to update report status");
    },
  });
};
