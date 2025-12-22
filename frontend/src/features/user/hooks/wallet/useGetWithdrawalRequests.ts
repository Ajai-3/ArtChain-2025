import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

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
  rejectionReason?: string | null;
  processedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface GetWithdrawalRequestsResponse {
  message: string;
  withdrawalRequests: WithdrawalRequest[];
  total: number;
  page: number;
  totalPages: number;
}

export const useGetWithdrawalRequests = (page = 1, limit = 6, status = "all", method = "all") => {
  return useQuery({
    queryKey: ["withdrawalRequests", page, limit, status, method],
    queryFn: async () => {
      const response = await apiClient.get<GetWithdrawalRequestsResponse>(
        `/api/v1/wallet/withdrawal/requests`, {
          params: { page, limit, status, method }
        }
      );
      return {
        requests: response.data.withdrawalRequests,
        total: response.data.total,
        totalPages: response.data.totalPages
      };
    },
    staleTime: 1000 * 60 * 5, 
  });
};
