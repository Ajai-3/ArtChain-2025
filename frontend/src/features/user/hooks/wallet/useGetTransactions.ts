// useGetTransactions.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export type Transaction = {
  id: string;
  createdAt: string;
  type: "credited" | "debited";
  status: "success" | "failed" | "pending";
  amount: number;
  method: "stripe" | "razorpay";
  category:
    | "TOP_UP"
    | "SALE"
    | "PURCHASE"
    | "WITHDRAWAL"
    | "COMMISSION"
    | "REFUND"
    | "OTHER";
  description?: string;
};

export type TransactionsResponse = {
  transactions: Transaction[];
  total: number;
  page: number;
  limit: number;
};

export const useGetTransactions = (
  page: number,
  limit: number,
  filters?: {
    method?: "stripe" | "razorpay";
    type?: "credited" | "debited";
    category?:
      | "TOP_UP"
      | "SALE"
      | "PURCHASE"
      | "WITHDRAWAL"
      | "COMMISSION"
      | "REFUND"
      | "OTHER";
  }
) => {
  return useQuery<TransactionsResponse>({
    queryKey: ["transactions", page, limit, filters],
    queryFn: async () => {
      const { data } = await apiClient.get("/api/v1/wallet/get-transactions", {
        params: { page, limit, ...filters },
      });

      return data;
    },
    placeholderData: (prev) => prev,
  });
};
