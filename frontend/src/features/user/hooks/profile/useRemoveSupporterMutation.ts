import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useRemoveSupporterMutation = (userId: string) => {
  return useMutation({
    mutationFn: async (supporterId: string) => {
      await apiClient.delete(
        `/api/v1/user/${userId}/supporters/${supporterId}`
      );
    },
  });
};
