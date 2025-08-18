import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import apiClient from "../../axios";
import type { AxiosResponse } from "axios";

export const useSupportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, Error, string>({
    mutationFn: (userId: string) =>
      apiClient.post(`/api/v1/user/support/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("Support failed:", error);
    },
  });
};

export const useUnSupportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, Error, string>({
    mutationFn: (userId: string) =>
      apiClient.delete(`/api/v1/user/un-support/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (error) => {
      console.error("UnSupport failed:", error);
    },
  });
};

export const useUpdateProfileMutation = () => {
    const dispatch = useDispatch();
    return useMutation({
        mutationFn: (credentials: { 
            name?: string;
            username?: string;
            bio?: string;
            country?: string;
            profileImage?: string;
            bannerImage?: string;
            backgroundImage?: string;
        }) => apiClient.patch("/api/v1/users/profile", credentials),
        onSuccess: (data: any) => {
            console.log("Profile updated successfully:", data);
            // dispatch(updateProfile(data));
        },
        onError: (error) => {
            console.error("Profile update failed:", error);
        },
    });
};
