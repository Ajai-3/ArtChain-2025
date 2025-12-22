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


export const useGetShopItemsByUser = (userId?: string) => {
  return useInfiniteQuery<
    PaginatedResponse<ShopItem>,
    Error
  >({
    queryKey: ["shopItemsByUser", userId],
    enabled: !!userId,
    queryFn: async ({ pageParam = 1, signal }) => {
      const res = await apiClient.get<PaginatedResponse<ShopItem>>(
        `/api/v1/art/shop/${userId}`,
        {
          params: { page: pageParam as number, limit: 12 },
          signal,
        }
      );
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.length < 12) return undefined;
      return lastPage.page + 1;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

