import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export interface LikedUser {
  userId: string;
  name: string;
  username: string;
  profileImage?: string;
  isSupporting: boolean;
  likedAt: string;
}

interface LikedUsersResponse {
  users: LikedUser[];
  likeCount: number;
  page: number;
  limit: number;
}

export const useGetLikedUsers = (postId: string, enabled = true) => {
  return useInfiniteQuery<LikedUsersResponse, Error>({
    queryKey: ["likedUsers", postId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get<LikedUsersResponse>(
        `/api/v1/art/likes/${postId}?page=${pageParam}&limit=5`
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
