import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ShopItem } from "../../../../types/apiResponses";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export interface ShopFilters {
  category?: string[];
  priceOrder?: "asc" | "desc";
  titleOrder?: "asc" | "desc";
  minPrice?: number;
  maxPrice?: number;
}

export interface PaginatedResponse<T = ShopItem> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
}

export const useGetAllShopItems = (filters?: ShopFilters) => {
  return useInfiniteQuery<PaginatedResponse, Error>({
    queryKey: ["shopItems", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params: Record<string, string | number | string[]> = { page: pageParam, limit: 15 };

      if (filters) {
        if (filters.category && filters.category.length > 0) {
          params.category = filters.category;
        }
        if (filters.priceOrder) params.priceOrder = filters.priceOrder;
        if (filters.titleOrder) params.titleOrder = filters.titleOrder;
        if (filters.minPrice != null) params.minPrice = filters.minPrice;
        if (filters.maxPrice != null) params.maxPrice = filters.maxPrice;
      }

      const res = await apiClient.get(API_ENDPOINTS.ART_SHOP, { params });
      return res.data as PaginatedResponse;
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.length < 15 ? undefined : lastPage.page + 1,
    initialPageParam: 1,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};
