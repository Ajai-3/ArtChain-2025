import apiClient from "../../../../api/axios";
import { useQuery } from "@tanstack/react-query";
import type { UserProfileApiResponse } from "../../../../types/users/user/userProfileApiResponse";

export const useGetUserProfileByUsername = (username?: string) => {
  return useQuery<UserProfileApiResponse>({
    queryKey: ["userProfile", username],
    queryFn: async (): Promise<UserProfileApiResponse> => {
      const res = await apiClient.get(`/api/v1/user/profile/${username}`);
      console.log("haii", res.data)
      return res.data;
    },
    enabled: true,
    retry: 2,
    refetchInterval: false,
  });
};
