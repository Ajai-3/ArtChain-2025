import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateBalanceAndLocked } from "../../../../redux/slices/walletSlice";

interface GiftArtCoinData {
  receiverId: string;
  amount: number;
  message?: string;
}

export const useGiftArtCoinMutation = () => {
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
  
    return useMutation({
      mutationFn: async (data: GiftArtCoinData) => {
        const response = await apiClient.post("/wallet/gift", data);
        return response.data;
      },
      onSuccess: (data) => {
        toast.success("Art Coins gifted successfully!");
        // Update wallet balance in redux if returned, or invalidate wallet query
        if (data.newBalance !== undefined) {
             dispatch(updateBalanceAndLocked({ 
                 balance: data.newBalance, 
                 lockedAmount: data.lockedAmount 
             }));
        } else {
            // Fallback: refetch wallet data
            queryClient.invalidateQueries({ queryKey: ["wallet"] });
        }
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to gift Art Coins");
      },
    });
  };
