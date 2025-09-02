import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

type ArtistRequestStatusResponse = {
  alreadySubmitted: boolean;
  latestRequest: any;
};

export const useHasSubmittedArtistRequest = (enabled: boolean) => {
  return useQuery<ArtistRequestStatusResponse, Error>({
    queryKey: ["artist-request-status"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/user/artist-request/status");
      console.log(res.data);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};
