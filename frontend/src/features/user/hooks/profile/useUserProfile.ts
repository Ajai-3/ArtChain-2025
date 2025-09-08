import apiClient from "../../../../api/axios";
import { useQuery } from "@tanstack/react-query";
import type { UserProfileApiResponse } from "../../../../types/users/user/userProfileApiResponse";

export const useUserProfile = () => {
  return useQuery<UserProfileApiResponse>({
    queryKey: ["userProfile", "me"],
    queryFn: async (): Promise<UserProfileApiResponse> => {
      const res = await apiClient.get("/api/v1/user/profile");
      return res.data;
    },
    retry: 2,
    refetchInterval: false,
  });
};
