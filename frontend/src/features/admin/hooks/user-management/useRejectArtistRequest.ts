import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useRejectArtistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await apiClient.patch(API_ENDPOINTS.ADMIN_ARTISTREQUEST_1(id), {
        reason,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artistRequests"] });
    },
  });
};
