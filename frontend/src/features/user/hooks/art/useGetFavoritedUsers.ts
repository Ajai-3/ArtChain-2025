import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export interface FavoritedUser {
  userId: string;
  name: string;
  username?: string;
  profileImage?: string;
  favoritedAt: string;
}

interface FavoritedUsersResponse {
  users: FavoritedUser[];
  favoriteCount: number;
  page: number;
  limit: number;
}

export const useGetFavoritedUsers = (postId: string, enabled = true) => {
  return useInfiniteQuery<FavoritedUsersResponse, Error>({
    queryKey: ["favoritedUsers", postId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get<FavoritedUsersResponse>(
        `/api/v1/art/favorites/${postId}?page=${pageParam}&limit=5`
      );
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.users.length < lastPage.limit ? undefined : lastPage.page + 1,
    initialPageParam: 1,
    enabled,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
