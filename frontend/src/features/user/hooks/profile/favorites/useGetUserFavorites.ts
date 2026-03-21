import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../../api/axios";


export type ArtDetails = {
  id: string;
  title: string;
  artName: string;
  description: string;
  imageUrl: string;
  isForSale: boolean;
  createdAt: string;
};

export type ArtUser = {
  id: string;
  name: string;
  username: string;
  profileImage: string;
};

export type ArtWithUser = {
  art: ArtDetails;
  user: ArtUser;
  likeCount: number;
  favoriteCount: number;
  commentCount: number;
  isLiked: boolean;
  isFavorited: boolean;
};

export type PaginatedResponse = {
  data: ArtWithUser[];
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
