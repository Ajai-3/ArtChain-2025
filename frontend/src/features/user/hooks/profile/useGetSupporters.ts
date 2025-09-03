import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { UserPreview } from "../../../../types/user/UserPreview";

interface UserResponse {
  data: UserPreview[];
  message: string;
}


export const useGetSupporters = (userId?: string, enabled: boolean = true) => {
  return useInfiniteQuery<UserResponse, Error>({
    queryKey: ["supporters", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await apiClient.get(`/api/v1/user/${userId}/supporters`, {
        params: { offset: pageParam, limit: 10 },
      });
      return res.data as UserResponse;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length < 10 ? undefined : allPages.length * 10,
    enabled: !!userId && enabled, 
    initialPageParam: 0,
  });
};