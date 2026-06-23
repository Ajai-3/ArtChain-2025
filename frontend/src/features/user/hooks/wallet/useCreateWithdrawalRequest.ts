import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { updateBalanceAndLocked } from "../../../../redux/slices/walletSlice";
import { useDispatch } from "react-redux";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface CreateWithdrawalRequestParams {
  amount: number;
  method: "BANK_TRANSFER" | "UPI";
  accountHolderName?: string;
  accountNumber?: string;
  ifscCode?: string;
  upiId?: string;
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  walletId: string;
  amount: number;
  method: string;
  status: string;
  accountHolderName?: string | null;
  accountNumber?: string | null;
  ifscCode?: string | null;
  upiId?: string | null;
  transactionId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateWithdrawalResponse {
  message: string;
  withdrawalRequest: WithdrawalRequest;
  wallet: WalletData;
}

export const useCreateWithdrawalRequest = () => {
  const dispatch = useDispatch();
  
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateWithdrawalRequestParams) => {
      const response = await apiClient.post<CreateWithdrawalResponse>(
        API_ENDPOINTS.WALLET_WITHDRAWAL_CREATE,
        params
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Update React Query cache - only update balance and lockedAmount
      queryClient.setQueryData(["wallet"], (oldData: { wallet?: WalletData } | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          wallet: {
            ...oldData.wallet,
            balance: data.wallet.balance,
            lockedAmount: data.wallet.lockedAmount,
            updatedAt: data.wallet.updatedAt,
          },
        };
      });
      
      // Invalidate withdrawal requests to refetch the list
      queryClient.invalidateQueries({ queryKey: ["withdrawalRequests"] });
      
      // Update Redux - only balance and lockedAmount
      dispatch(updateBalanceAndLocked({
        balance: data.wallet.balance,
        lockedAmount: data.wallet.lockedAmount,
      }));
      
      toast.success(data.message);
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create withdrawal request";
      
      toast.error(errorMessage);
      
      console.error("Withdrawal request error:", err);
    },
  });
};
