import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useApproveArtistRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch(API_ENDPOINTS.ADMIN_ARTISTREQUEST(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["artistRequests"] });
    },
  });
};
