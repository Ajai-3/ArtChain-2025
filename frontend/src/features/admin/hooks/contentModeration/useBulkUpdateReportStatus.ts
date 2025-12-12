import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

interface BulkUpdateParams {
  targetId: string;
  targetType: string;
  status: "resolved" | "dismissed";
}

export const useBulkUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetId, targetType, status }: BulkUpdateParams) => {
      console.log('[Frontend] Bulk update request:', { targetId, targetType, status });
      const response = await apiClient.patch(`/api/v1/admin/reports/bulk-status`, {
        targetId,
        targetType,
        status,
      });
      console.log('[Frontend] Bulk update response:', response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log('[Frontend] Bulk update success, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ["admin-grouped-reports"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
      toast.success(data.message || "Reports updated successfully");
    },
    onError: (error: any) => {
      console.error('[Frontend] Bulk update error:', error);
      toast.error(error?.response?.data?.message || "Failed to update reports");
    },
  });
};
