import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

interface UpdateWithdrawalStatusParams {
  withdrawalId: string;
  status: string;
  rejectionReason?: string;
}

export const useUpdateWithdrawalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: UpdateWithdrawalStatusParams) => {
      const response = await apiClient.patch(
        `/api/v1/wallet/admin/withdrawal/requests/${params.withdrawalId}/status`,
        {
          status: params.status,
          rejectionReason: params.rejectionReason,
        }
      );
      return response.data;
    },
    onMutate: async (newWithdrawal) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admin", "withdrawalRequests"] });

      // Snapshot all previous queries
      const previousQueries: any[] = [];
      queryClient.getQueriesData({ queryKey: ["admin", "withdrawalRequests"] }).forEach(([queryKey, data]) => {
        previousQueries.push({ queryKey, data });
      });

      // Optimistically update all matching queries
      queryClient.setQueriesData(
        { queryKey: ["admin", "withdrawalRequests"] },
        (old: any) => {
          if (!old || !old.withdrawalRequests) return old;

          const updatedRequests = old.withdrawalRequests.map((withdrawal: any) =>
            withdrawal.id === newWithdrawal.withdrawalId
              ? { 
                  ...withdrawal, 
                  status: newWithdrawal.status, 
                  rejectionReason: newWithdrawal.rejectionReason,
                  processedAt: new Date().toISOString()
                }
              : withdrawal
          );

          return {
            ...old,
            withdrawalRequests: updatedRequests,
          };
        }
      );

      return { previousQueries };
    },
    onError: (err: any, _newWithdrawal, context) => {
      // Restore all previous queries on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }: any) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error(
        err.response?.data?.message || "Failed to update withdrawal status"
      );
    },
    onSuccess: (_data, variables) => {
      const statusMessages: Record<string, string> = {
        APPROVED: "Withdrawal request approved successfully",
        REJECTED: "Withdrawal request rejected",
        COMPLETED: "Withdrawal marked as completed",
        PROCESSING: "Withdrawal status updated to processing",
      };

      toast.success(
        statusMessages[variables.status] || "Withdrawal status updated"
      );
      
      // Invalidate to refetch with correct data from server
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawalRequests"] });
    },
  });
};
