import apiClient from "../../axios";
import { useInfiniteQuery } from "@tanstack/react-query";

interface Artwork {
  _id: string;
  title: string;
  description: string;
  images: string[];
}

export const useFetchArtworks = () => {
  return useInfiniteQuery<Artwork[], Error>({
    queryKey: ['artworks'],
    queryFn: async ({ pageParam = undefined }) => {
      const res = await apiClient.get('/api/v1/art', {
        params: pageParam ? { lastId: pageParam } : {}
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length === 0) return undefined;
      const lastArtwork = lastPage[lastPage.length - 1];
      return lastArtwork._id;
    },
    initialPageParam: undefined,
  });
};
