import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useApproveArtistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(`/api/v1/admin/artist-request/${id}/approve`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artistRequests"] });
    },
  });
};
