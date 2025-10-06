import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../../api/axios";

export type Art = {
  _id: string;
  artName: string;
  imageUrl: string;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  isLiked: boolean;
  isFavorited: boolean; // always true
};

export type PaginatedResponse = {
  data: Art[];
  page: number;
  total: number;
};

export const useGetUserFavorites = (userId: string) => {
  return useInfiniteQuery<PaginatedResponse, Error>({
    queryKey: ["userFavorites", userId],
    queryFn: async ({ pageParam = 1, signal }) => {
      const res = await apiClient.get(`/api/v1/art/favorites/user/${userId}`, {
        params: { page: pageParam, limit: 15 },
        signal,
      });
      return res.data as PaginatedResponse;
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.length < 15 ? undefined : lastPage.page + 1,
    initialPageParam: 1,
    enabled: !!userId,
  });
};
