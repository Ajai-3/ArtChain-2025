// src/features/user/hooks/profile/useRemoveSupporter.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../redux/store";

interface RemoveSupporterPayload {
  supporterId: string;
  supporterUsername: string;
}

export const useRemoveSupporter = () => {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.user.user);

  return useMutation<
    { supporterId: string; supporterUsername: string },
    Error,
    RemoveSupporterPayload
  >({
    mutationFn: async ({ supporterId, supporterUsername }) => {
      await apiClient.delete(`/api/v1/user/remove/${supporterId}`);
      return { supporterId, supporterUsername };
    },

    onSuccess: ({ supporterUsername }) => {
      const myUsername = user?.username;
      if (!myUsername) return;

      // 1) Update my profile (decrement supportersCount)
      queryClient.setQueryData(["userProfile", myUsername], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            supportersCount: Math.max(0, (old.data.supportersCount ?? 0) - 1),
          },
        };
      });

      // 2) Update removed user's profile (decrement supportingCount, reset isSupporting)
      queryClient.setQueryData(
        ["userProfile", supporterUsername],
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              isSupporting: false,
              supportingCount: Math.max(0, (old.data.supportingCount ?? 0) - 1),
            },
          };
        }
      );
    },

    onError: (err) => {
      console.error("Remove supporter failed:", err);
    },
  });
};
