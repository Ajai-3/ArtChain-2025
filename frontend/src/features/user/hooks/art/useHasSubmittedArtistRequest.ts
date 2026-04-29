import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';

import type { ArtistRequest } from "../../../../types/artist";

type ArtistRequestStatusResponse = {
  alreadySubmitted: boolean;
  latestRequest: ArtistRequest | null;
};

export const useHasSubmittedArtistRequest = (enabled: boolean) => {
  return useQuery<ArtistRequestStatusResponse, Error>({
    queryKey: ['artist-request-status'],
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/user/artist-request/status');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};
