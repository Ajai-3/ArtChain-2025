import apiClient from "../../../../api/axios";
import { useQuery } from "@tanstack/react-query";
import type { UserProfileApiResponse } from "../../../../types/users/user/userProfileApiResponse";

export const useUserProfileWithId = (userId: string) => {
  return useQuery<UserProfileApiResponse>({
    queryKey: ["userProfile", userId],
    queryFn: async (): Promise<UserProfileApiResponse> => {
      const res = await apiClient.get(`/api/v1/user/profile/${userId}`);
      return res.data;
    },
    enabled: !!userId,
    retry: 2,
    refetchInterval: false,
  });
};
