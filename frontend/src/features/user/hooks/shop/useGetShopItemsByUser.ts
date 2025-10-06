import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export interface ShopItem {
  id: string;
  title: string;
  artName: string;
  previewUrl: string;
  artType: string;
  priceType: string;
  artcoins: number;
  fiatPrice?: number;
  status: string;
  favoriteCount: number;
  user: {
    id: string;
    name: string;
    username: string;
    profileImage?: string;
  };
}

export interface PaginatedResponse<T = ShopItem> {
  success: boolean;
  data: T[];
  page: number;
  limit: number;
}

export const useGetShopItemsByUser = (userId: string) => {
  return useInfiniteQuery<PaginatedResponse<ShopItem>, Error, PaginatedResponse<ShopItem>, number>({
    queryKey: ["shopItemsByUser", userId],
    queryFn: async ({ pageParam = 1, signal }) => {
      const res = await apiClient.get<PaginatedResponse<ShopItem>>(
        `/api/v1/art/shop/${userId}`,
        {
          params: { page: pageParam, limit: 12 },
          signal, // allows cancellation
        }
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (!lastPage.data || lastPage.data.length === 0) return undefined;
      return lastPage.page + 1;
    },
    staleTime: 1000 * 60 * 2,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};

