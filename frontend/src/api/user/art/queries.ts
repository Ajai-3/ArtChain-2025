import apiClient from "../../axios";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

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


type ArtistRequestStatusResponse = {
  alreadySubmitted: boolean;
  latestRequest: any;
};

export const useHasSubmittedArtistRequest = () => {
  return useQuery<ArtistRequestStatusResponse, Error>({
    queryKey: ['hasUserSubmittedRequest'],
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/user/artist-request/status');
      console.log(res.data)
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
