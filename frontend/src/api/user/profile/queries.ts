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
      const res = await apiClient.get("/api/v1/user/profile");
      return res.data; 
    },
    retry: 2,
    refetchInterval: false,
  });
};

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
