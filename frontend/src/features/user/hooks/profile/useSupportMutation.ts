import type { AxiosResponse } from "axios";
import apiClient from "../../../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

interface SupportPayload {
  userId: string;
  username: string;
}

export const useSupportMutation = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user.user);

  return useMutation<AxiosResponse<any>, Error, SupportPayload>({
    mutationFn: ({ userId }: { userId: string }) =>
      apiClient.post(`/api/v1/user/support/${userId}`),
    onSuccess: (_, { username }) => {
      queryClient.setQueryData(["userProfile", username], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            isSupporting: true,
            supportersCount: old.data.supportersCount + 1,
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
            supportingCount: old.data.supportingCount + 1,
          },
        };
      });

      // likedUsers
      queryClient
        .getQueriesData<any>({ queryKey: ["likedUsers"] })
        .forEach(([key, prev]) => {
          if (!prev) return;

          const newData = {
            ...prev,
            pages: prev.pages.map((page: any) => ({
              ...page,
              users: page.users.map((u: any) =>
                u.username === username ? { ...u, isSupporting: true } : u
              ),
            })),
          };

          queryClient.setQueryData(key, newData);
        });

        // favoritedUsers
        queryClient
        .getQueriesData<any>({ queryKey: ["favoritedUsers"] })
        .forEach(([key, prev]) => {
          if (!prev) return;

          const newData = {
            ...prev,
            pages: prev.pages.map((page: any) => ({
              ...page,
              users: page.users.map((u: any) =>
                u.username === username ? { ...u, isSupporting: true } : u
              ),
            })),
          };

          queryClient.setQueryData(key, newData);
        });
    },

    onError: (error) => {
      console.error("Support failed:", error);
    },
  });
};
