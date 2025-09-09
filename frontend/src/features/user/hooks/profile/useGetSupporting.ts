import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { UserPreview } from "../../../../types/users/user/UserPreview";

interface UserResponse {
  data: UserPreview[];
  message: string;
}

export const useGetSupporting = (userId?: string, enabled: boolean = true) => {
  return useInfiniteQuery<UserResponse, Error>({
    queryKey: ["supporting", userId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get(`/api/v1/user/${userId}/supporting`, {
        params: { page: pageParam, limit: 10 },
      });
      return res.data as UserResponse;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length < 10 ? undefined : allPages.length + 1,
    enabled: !!userId && enabled,
    initialPageParam: 1,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};
