import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useRejectArtistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await apiClient.patch(`/api/v1/admin/artist-request/${id}/reject`, {
        reason,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artistRequests"] });
    },
  });
};
