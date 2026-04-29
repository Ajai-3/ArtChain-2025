import type { AxiosResponse } from "axios";
import apiClient from "../../../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";
import type { UserProfileApiResponse } from "../../../../types/users/user/userProfileApiResponse";

interface SupportPayload {
  userId: string;
  username: string;
}

export const useSupportMutation = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user.user);

  return useMutation<AxiosResponse, Error, SupportPayload>({
    mutationFn: ({ userId }: { userId: string }) =>
      apiClient.post(`/api/v1/user/support/${userId}`),
    onSuccess: (_, { username }) => {
      queryClient.setQueryData(["userProfile", username], (old: UserProfileApiResponse | undefined) => {
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

      queryClient.setQueryData(["userProfile", user?.username], (old: UserProfileApiResponse | undefined) => {
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
        .getQueriesData<{ pages: Array<{ users: Array<{ username: string; isSupporting?: boolean }> }> }>({ queryKey: ["likedUsers"] })
        .forEach(([key, prev]) => {
          if (!prev) return;

          const newData = {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              users: page.users.map((u) =>
                u.username === username ? { ...u, isSupporting: true } : u
              ),
            })),
          };

          queryClient.setQueryData(key, newData);
        });

      // favoritedUsers
      queryClient
        .getQueriesData<{ pages: Array<{ users: Array<{ username: string; isSupporting?: boolean }> }> }>({ queryKey: ["favoritedUsers"] })
        .forEach(([key, prev]) => {
          if (!prev) return;

          const newData = {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              users: page.users.map((u) =>
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
