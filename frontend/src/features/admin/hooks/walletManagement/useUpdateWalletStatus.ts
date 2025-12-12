import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useUpdateWalletStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      walletId,
      status,
    }: {
      walletId: string;
      status: "active" | "locked" | "suspended";
    }) => {
      const res = await apiClient.patch(
        `/api/v1/wallet/admin/wallets/${walletId}/status`,
        { status }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-wallets"] });
      toast.success(`Wallet status updated to ${variables.status}`);
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update wallet status"
      );
    },
  });
};
