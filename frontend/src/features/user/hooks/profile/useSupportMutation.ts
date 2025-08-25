import type { AxiosResponse } from "axios";
import apiClient from "../../../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSupportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, Error, string>({
    mutationFn: (userId: string) =>
      apiClient.post(`/api/v1/user/support/${userId}`),
    onSuccess: (_, userId) => {
        // Update the visited user profile.
      queryClient.setQueryData(["userProfile", userId], (old: any) => {
        if (!old) return old;
        return {
            ...old,
            data: {
                ...old.data,
                isSupporting: true,
                supportersCount: old.data.supportersCount + 1
            }
        }
      });

      // Update current user profile ("me")
      queryClient.setQueriesData({ queryKey: ["userProfile", "me"] }, (old: any) => {
        if (!old) return old;
        return {
            ...old,
            data: {
                ...old.data,
                supportingCount: old.data.supportingCount + 1
            }
        }
      })
    },
    onError: (error) => {
      console.error("Support failed:", error);
    },
  });
};