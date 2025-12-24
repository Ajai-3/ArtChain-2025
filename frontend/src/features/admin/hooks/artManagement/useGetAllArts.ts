import { useQuery, keepPreviousData } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

interface ArtResponse {
  data: any[];
  meta: any;
  stats?: {
    total: number;
    free: number;
    premium: number;
    aiGenerated: number;
  };
}

interface Filters {
  status?: string;
  postType?: string;
  priceType?: string;
  search?: string;
  userId?: string;
}

export const useGetAllArts = (
  page: number,
  limit: number,
  filters?: Filters
) => {
  return useQuery<ArtResponse>({
    queryKey: ["admin-arts", page, limit, filters],
    queryFn: async () => {
      const params: any = {
        page,
        limit,
        ...filters,
      };

      // Filter out "all" values
      if (params.status === "all") delete params.status;
      if (params.postType === "all") delete params.postType;
      if (params.priceType === "all") delete params.priceType;

      const response = await apiClient.get("/api/v1/art/admin/art", { params });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
