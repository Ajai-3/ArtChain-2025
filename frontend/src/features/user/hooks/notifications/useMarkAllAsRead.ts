import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useMarkAllAsRead = () => {
  return useMutation<void, Error>({
    mutationFn: async () => {
      await apiClient.patch("/api/v1/notifications/mark-all-read");
    },
  });
};
