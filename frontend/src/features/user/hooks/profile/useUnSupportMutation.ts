import type { AxiosResponse } from "axios";
import apiClient from "../../../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
export const useUnSupportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, Error, string>({
    mutationFn: (userId: string) =>
      apiClient.delete(`/api/v1/user/un-support/${userId}`),

    onSuccess: (_, userId) => {
      // Update the visited user profile
      queryClient.setQueryData(["userProfile", userId], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            isSupporting: false,
            supportersCount: old.data.supportersCount - 1,
          },
        };
      });

      // Update the current user profile ("me")
      queryClient.setQueryData(["userProfile", "me"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            supportingCount: old.data.supportingCount - 1,
          },
        };
      });
    },

    onError: (error) => {
      console.error("UnSupport failed:", error);
    },
  });
};
