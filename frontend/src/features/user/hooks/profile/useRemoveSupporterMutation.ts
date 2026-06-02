import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useRemoveSupporterMutation = (userId: string) => {
  return useMutation({
    mutationFn: async (supporterId: string) => {
      await apiClient.delete(
        API_ENDPOINTS.USER_2(userId, supporterId)
      );
    },
  });
};
