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

      if (search) {
        params.query = search;
      }

      if (params.status === "all") delete params.status;

      const res = await apiClient.get(`/api/v1/wallet/admin/wallets`, { params });
      return res.data;
    },
    placeholderData: (previousData) => previousData, 
  });
};
