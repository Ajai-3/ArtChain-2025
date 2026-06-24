import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../../api/axios";
import { API_ENDPOINTS } from "../../../../../constants/apiEndpoints";

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
export const useGetUserLikedArts = () => {
  return useInfiniteQuery<PaginatedResponse, Error>({
    queryKey: ["userLikedArts"],
    queryFn: async ({ pageParam = 1, signal }) => {
      const res = await apiClient.get(API_ENDPOINTS.ART_LIKE_LIKEDARTS, {
        params: { page: pageParam, limit: 15 },
        signal,
      });
      return {
        data: res.data.data.arts || [],
        page: res.data.page,
        total: res.data.data.totalCount || 0
      } as PaginatedResponse;
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.length < 15 ? undefined : lastPage.page + 1,
    initialPageParam: 1,
  });
};
