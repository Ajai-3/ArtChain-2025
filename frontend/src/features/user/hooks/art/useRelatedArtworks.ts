import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUser } from "./useGetAllArt";

interface RecommendedArtResponse {
  message: string;
  page: number;
  limit: number;
  data: ArtWithUser[];
}

export const useRelatedArtworks = (
  categoryId: string | undefined,
  currentArtId: string
) => {
  const limit = 10;

  // 1. Category Query
  const categoryQuery = useInfiniteQuery<RecommendedArtResponse, Error>({
    queryKey: ["relatedArt", "category", categoryId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get("/api/v1/art/recommended", {
        params: { page: pageParam, limit, categoryId },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.length < limit ? undefined : lastPage.page + 1,
    initialPageParam: 1,
    enabled: !!categoryId,
    refetchOnWindowFocus: false,
  });

  // 2. General Query (Fallback)
  const generalQuery = useInfiniteQuery<RecommendedArtResponse, Error>({
    queryKey: ["relatedArt", "general"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get("/api/v1/art/recommended", {
        params: { page: pageParam, limit },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.length < limit ? undefined : lastPage.page + 1,
    initialPageParam: 1,
    // Enable only if category query is done (or failed/empty)
    enabled: !categoryQuery.hasNextPage && !categoryQuery.isLoading,
    refetchOnWindowFocus: false,
  });

  // Combine Data
  const categoryArts =
    categoryQuery.data?.pages.flatMap((page) => page.data) || [];
  const generalArts =
    generalQuery.data?.pages.flatMap((page) => page.data) || [];

  // Filter duplicates and current art
  const allArts = [...categoryArts, ...generalArts].filter(
    (item, index, self) =>
      item.art.id !== currentArtId &&
      index === self.findIndex((t) => t.art.id === item.art.id)
  );

  const fetchNextPage = () => {
    if (categoryQuery.hasNextPage) {
      categoryQuery.fetchNextPage();
    } else if (generalQuery.hasNextPage) {
      generalQuery.fetchNextPage();
    }
  };

  const hasNextPage = categoryQuery.hasNextPage || generalQuery.hasNextPage;
  const isLoading = categoryQuery.isLoading || (categoryQuery.isFetched && generalQuery.isLoading && !categoryArts.length);
  const isFetching = categoryQuery.isFetching || generalQuery.isFetching;

  return {
    data: allArts,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    error: categoryQuery.error || generalQuery.error,
  };
};
