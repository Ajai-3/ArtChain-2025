import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { User } from "../../../../types/user/user";

interface UserResponse {
  users: User[];
}
export const useGetSupporting = (userId?: string, enabled: boolean = true) => {
  return useInfiniteQuery<UserResponse, Error>({
    queryKey: ["supporting", userId],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await apiClient.get(`/api/v1/user/${userId}/supporting`, {
        params: { offset: pageParam, limit: 10 },
      });
      return res.data as UserResponse;
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.users.length < 10 ? undefined : allPages.length * 10,
    enabled: !!userId && enabled, // ✅ only fetch when enabled
    initialPageParam: 0,
  });
};