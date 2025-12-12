import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { useDispatch } from "react-redux";
import { setWalletData } from "../../../../redux/slices/walletSlice";

interface Transaction {
  id: string | number;
  date: string;
  type: "Earned" | "Spent";
  amount: number;
  category?: string;
}

export interface Wallet {
  balance: number;
  inrValue: number;
  lockedAmount: number;
  quickStats: {
    earned: number;
    spent: number;
    avgTransaction: number;
    roi: string;
    grade: string;
  };
  transactionSummary: {
    earned: number;
    spent: number;
    netGain: number;
  };
  transactions: Transaction[];
}

export const useGetWallet = () => {
  const dispatch = useDispatch();

  return useQuery<Wallet>({
    queryKey: ["wallet"],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/wallet/details");
      dispatch(setWalletData(data.wallet));
      return data;
    },
  });
};
