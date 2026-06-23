import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useMarkAllAsRead = () => {
  return useMutation<void, Error>({
    mutationFn: async () => {
      await apiClient.patch(API_ENDPOINTS.NOTIFICATIONS_MARKALLREAD);
    },
  });
};
