

import apiClient from "../../axios";
import { updateProfile } from "../../../redux/slices/userSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useSupportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      apiClient.post(`/api/v1/user/support/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
    onError: (error) => {
      console.error("Support failed:", error);
    },
  });
};

export const useUnSupportMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) =>
      apiClient.delete(`/api/v1/user/un-support/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["profile"]);
    },
    onError: (error) => {
      console.error("UnSupport failed:", error);
    },
  });
};

