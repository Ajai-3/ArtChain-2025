import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import type { WithdrawalData } from "../../../../types/withdrawal";

interface BulkUpdateParams {
  withdrawalIds: string[];
  status: string;
  rejectionReason?: string;
}

export const useBulkUpdateWithdrawalStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ withdrawalIds, status, rejectionReason }: BulkUpdateParams) => {
      // Execute all updates in parallel
      const updatePromises = withdrawalIds.map((id) =>
        apiClient.patch(`/api/v1/wallet/admin/withdrawal/requests/${id}/status`, {
          status,
          ...(rejectionReason && { rejectionReason }),
        })
      );
      await Promise.all(updatePromises);
      return { withdrawalIds, status };
    },
    onMutate: async ({ withdrawalIds, status, rejectionReason }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["admin", "withdrawalRequests"] });

      // Snapshot all previous queries
      const previousQueries: Array<{ queryKey: string[]; data: unknown }> = [];
      queryClient.getQueriesData({ queryKey: ["admin", "withdrawalRequests"] }).forEach(([queryKey, data]) => {
        previousQueries.push({ queryKey: queryKey as string[], data });
      });

      // Optimistically update all matching queries
      queryClient.setQueriesData(
        { queryKey: ["admin", "withdrawalRequests"] },
        (old: { withdrawalRequests?: WithdrawalData[]; statusCounts?: Record<string, number> } | undefined) => {
          if (!old || !old.withdrawalRequests) return old;

          // Update the withdrawal requests
          const updatedRequests = old.withdrawalRequests.map((withdrawal) =>
            withdrawalIds.includes(withdrawal.id)
              ? { 
                  ...withdrawal, 
                  status,
                  ...(rejectionReason && { rejectionReason }),
                  processedAt: new Date().toISOString()
                }
              : withdrawal
          );

          // Update status counts
          const updatedStatusCounts = { ...old.statusCounts };
          withdrawalIds.forEach(() => {
            // This is a simplified update - the real counts will come from the server
            if (updatedStatusCounts[status]) {
              updatedStatusCounts[status]++;
            } else {
              updatedStatusCounts[status] = 1;
            }
          });

          return {
            ...old,
            withdrawalRequests: updatedRequests,
            statusCounts: updatedStatusCounts,
          };
        }
      );

      return { previousQueries };
    },
    onError: (_err: Error, _variables: BulkUpdateParams, context: { previousQueries?: Array<{ queryKey: string[]; data: unknown }> } | undefined) => {
      // Restore all previous queries on error
      if (context?.previousQueries) {
        context.previousQueries.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error("Failed to process some withdrawal requests.");
    },
    onSuccess: (_data: unknown, { status }: BulkUpdateParams) => {
      toast.success(`Selected requests marked as ${status}`);
      // Invalidate to refetch with correct data from server
      queryClient.invalidateQueries({ queryKey: ["admin", "withdrawalRequests"] });
    },
  });
};
