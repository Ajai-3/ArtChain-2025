import type { AxiosResponse } from "axios";
import apiClient from "../../../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { RootState } from "../../../../redux/store";
import { useSelector } from "react-redux";

interface SupportPayload {
  userId: string;
  username: string;
}

export const useUnSupportMutation = () => {
  const queryClient = useQueryClient();
    const user = useSelector((state: RootState) => state.user.user)

  return useMutation<AxiosResponse<any>, Error, SupportPayload>({
    mutationFn: ({ userId }: { userId: string }) =>
      apiClient.delete(`/api/v1/user/un-support/${userId}`),

    onSuccess: (_, { username }) => {
      queryClient.setQueryData(["userProfile", username], (old: any) => {
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
      queryClient.setQueryData(["userProfile", user?.username], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            isSupporting: true,
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
