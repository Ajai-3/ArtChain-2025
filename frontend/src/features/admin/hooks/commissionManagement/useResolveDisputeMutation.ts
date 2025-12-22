import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { ROUTES } from "../../../../constants/routes";
import { toast } from "react-hot-toast";

export const useResolveDisputeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, resolution }: { id: string, resolution: 'REFUND' | 'RELEASE' }) => {
      const url = ROUTES.ADMIN.ADMIN_RESOLVE_COMMISSION.replace(':id', id);
      const response = await apiClient.post(url, { resolution });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-commissions'] });
      toast.success("Dispute resolved successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to resolve dispute");
    }
  });
};
