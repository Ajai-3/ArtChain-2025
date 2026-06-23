import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface BulkUpdateParams {
  targetId: string;
  targetType: string;
  status: 'resolved' | 'dismissed';
}

export const useBulkUpdateReportStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ targetId, targetType, status }: BulkUpdateParams) => {
      const response = await apiClient.patch(
        API_ENDPOINTS.ADMIN_REPORTS_BULKSTATUS,
        {
          targetId,
          targetType,
          status,
        },
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-grouped-reports'] });
      queryClient.invalidateQueries({ queryKey: ['admin-reports'] });
      toast.success(data.message || 'Reports updated successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to update reports');
    },
  });
};
