import toast from "react-hot-toast";
import apiClient from "../../../../api/axios";
import { useMutation } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const changePasswordMutation = () => {
  return useMutation({
    mutationFn: (credentials: {
      currentPassword: string;
      newPassword: string;
    }) => apiClient.patch(API_ENDPOINTS.AUTH_CHANGEPASSWORD, credentials),
    onSuccess: (res) => {
      console.log("Password changed successful:", res.data);
      toast.success("Password changed successful");
    },
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};