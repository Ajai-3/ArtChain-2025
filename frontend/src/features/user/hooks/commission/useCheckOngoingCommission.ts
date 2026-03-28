import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

/**
 * Checks if the current user already has an ongoing commission with the given artist.
 * "Ongoing" = REQUESTED | NEGOTIATING | AGREED | LOCKED | IN_PROGRESS | DISPUTE_RAISED
 *
 * @param requesterId - The current logged-in user's ID
 * @param artistId    - The artist's ID
 * @param enabled     - Only run the query when the modal is open
 */
export const useCheckOngoingCommission = (
  requesterId: string | undefined,
  artistId: string | undefined,
  enabled = false
) => {
  return useQuery({
    queryKey: ["commission-ongoing", requesterId, artistId],
    queryFn: async () => {
      const response = await apiClient.get<{ hasOngoing: boolean }>(
        `/api/v1/art/commission/check-ongoing`,
        { params: { artistId } }
      );
      return response.data;
    },
    enabled: !!requesterId && !!artistId && enabled,
    staleTime: 0,        // always fresh when modal opens
    gcTime: 0,           // don't cache between opens
  });
};
