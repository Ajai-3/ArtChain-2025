import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

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
        API_ENDPOINTS.WALLET_ADMIN_WALLETS_2(walletId),
        { status }
      );
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-wallets"] });
      toast.success(`Wallet status updated to ${variables.status}`);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(
        err?.response?.data?.message || "Failed to update wallet status"
      );
    },
  });
};
