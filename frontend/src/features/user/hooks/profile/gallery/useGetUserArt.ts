import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../../api/axios";
import type { PaginatedResponse } from "../../art/useGetAllArt";

export const useGetUserArt = (userId: string) => {
  return useInfiniteQuery<PaginatedResponse, Error>({
    queryKey: ["userGallery", userId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!userId) throw new Error("User ID is required");

      const res = await apiClient.get(`/api/v1/art/user/${userId}`, {
        params: { page: pageParam, limit: 15 },
      });

      return res.data as PaginatedResponse;
    },
    getNextPageParam: (lastPage: PaginatedResponse) =>
      lastPage.data.length < 15 ? undefined : lastPage.page + 1,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
};
