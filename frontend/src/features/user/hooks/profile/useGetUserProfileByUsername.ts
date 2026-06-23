import apiClient from "../../../../api/axios";
import { useQuery } from "@tanstack/react-query";
import type { UserProfileApiResponse } from "../../../../types/users/user/userProfileApiResponse";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetUserProfileByUsername = (username?: string) => {
  return useQuery<UserProfileApiResponse>({
    queryKey: ["userProfile", username],
    queryFn: async (): Promise<UserProfileApiResponse> => {
      const res = await apiClient.get(API_ENDPOINTS.USER_PROFILE(username));
      return res.data;
    },
    enabled: true,
    retry: (failureCount, error: { response?: { status: number } }) => {
      if (error?.status === 404) return false;
      return failureCount < 2;
    },
    refetchInterval: false,
  });
};
