import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

interface AuctionResponse {
  data: {
      auctions: any[];
      total: number;
      stats?: {
        active: number;
        ended: number;
        sold: number;
        unsold: number;
      };
  };
}

interface Filters {
  status?: string;
  search?: string;
  hostId?: string;
  startDate?: string;
  endDate?: string;
}

export const useGetAllAuctions = (
  page: number,
  limit: number,
  filters?: Filters
) => {
  return useQuery<AuctionResponse>({
    queryKey: ["admin-auctions", page, limit, filters],
    queryFn: async () => {
      const params: any = {
        page,
        limit,
        ...filters,
      };

      // If status is 'all', we send 'ALL' to backend to bypass default filtering
      if (params.status && params.status.toLowerCase() === "all") {
          params.status = "ALL";
      }

      const response = await apiClient.get("/api/v1/art/admin/auctions", { params });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
