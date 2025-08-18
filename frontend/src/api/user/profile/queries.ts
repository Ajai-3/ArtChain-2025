import apiClient from "../../axios";
import type { User } from "../../../types/user";
import { useQuery } from "@tanstack/react-query";

interface UserProfileResponse {
  user: User;
  supportingCount: number;
  supportersCount: number;
}

export const useUserProfile = () => {
  return useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: () => apiClient.get("api/v1/user/profile"),
    retry: 2,
    refetchInterval: false,
  });
};

export const useUserProfileWithId = (userId: string) => {
  return useQuery<UserProfileResponse>({
    queryKey: ["userProfile", userId],
    queryFn: () => apiClient.get(`api/v1/user/profile/${userId}`),
    enabled: !!userId,
    retry: 2,
    refetchInterval: false,
  });
};
