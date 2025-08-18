import apiClient from "../../axios";
import type { User } from "../../../types/user";
import { useQuery } from "@tanstack/react-query";

interface UserProfileApiResponse {
  message: string;
  data: {
    user: User;
    supportingCount: number;
    supportersCount: number;
    isSupporting?: boolean;
  };
}

export const useUserProfile = () => {
  return useQuery<UserProfileApiResponse>({
    queryKey: ["userProfile"],
    queryFn: async (): Promise<UserProfileApiResponse> => {
      return apiClient.get("/api/v1/user/profile");
    },
    retry: 2,
    refetchInterval: false,
  });
};

export const useUserProfileWithId = (userId: string) => {
  return useQuery<UserProfileApiResponse>({
    queryKey: ["userProfile", userId],
    queryFn: async (): Promise<UserProfileApiResponse> => {
      return apiClient.get(`/api/v1/user/profile/${userId}`);
    },
    enabled: !!userId,
    retry: 2,
    refetchInterval: false,
  });
};
