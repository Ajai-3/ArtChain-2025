import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';

import type { ArtistRequest } from "../../../../types/artist";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

type ArtistRequestStatusResponse = {
  alreadySubmitted: boolean;
  latestRequest: ArtistRequest | null;
};

export const useHasSubmittedArtistRequest = (enabled: boolean) => {
  return useQuery<ArtistRequestStatusResponse, Error>({
    queryKey: ['artist-request-status'],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.USER_ARTISTREQUEST_STATUS);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    enabled,
  });
};
