import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface Filters {
  status?: string;
  minBalance?: number;
  maxBalance?: number;
}

export const useGetAllWallets = ({
  page,
  limit,
  search,
  filters,
}: {
  page: number;
  limit: number;
  search: string;
  filters: Filters;
}) => {
  return useQuery({
    queryKey: ["admin-wallets", page, limit, search, filters],
    queryFn: async () => {
      const params: Record<string, string | number | undefined> = {
        page,
        limit,
        ...filters,
      };

      if (search) {
        params.query = search;
      }

      if (params.status === "all") delete params.status;

      const res = await apiClient.get(API_ENDPOINTS.WALLET_ADMIN_WALLETS, { params });
      return res.data;
    },
    placeholderData: (previousData) => previousData, 
  });
};
