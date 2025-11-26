import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

interface TransactionFilters {
  type?: string;
  category?: string;
  status?: string;
  method?: string;
  startDate?: Date;
  endDate?: Date;
}

export const useGetUserTransactions = ({
  walletId,
  page,
  limit,
  filters,
  enabled = true,
}: {
  walletId: string;
  page: number;
  limit: number;
  filters: TransactionFilters;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: ["admin-user-transactions", walletId, page, limit, filters],
    queryFn: async () => {
      const params: any = {
        page,
        limit,
        ...filters,
      };

      // Filter out "all" values
      if (params.type === "all") delete params.type;
      if (params.category === "all") delete params.category;
      if (params.status === "all") delete params.status;
      if (params.method === "all") delete params.method;

      const res = await apiClient.get(
        `/api/v1/wallet/admin/wallets/${walletId}/transactions`,
        { params }
      );
      return res.data;
    },
    enabled: !!walletId && enabled,
  });
};
