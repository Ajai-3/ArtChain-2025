import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

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
      const params: any = {
        page,
        limit,
        ...filters,
      };

      // If search is present, use the search endpoint
      const endpoint = search
        ? `/api/v1/wallet/admin/wallets/search`
        : `/api/v1/wallet/admin/wallets`;

      if (search) {
        params.query = search;
      }

      // Filter out "all" values
      if (params.status === "all") delete params.status;

      const res = await apiClient.get(endpoint, { params });
      return res.data;
    },
  });
};
