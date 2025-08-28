import toast from "react-hot-toast";
import apiClient from "../../../../api/axios";
import { useMutation } from "@tanstack/react-query";

export const changePasswordMutation = () => {
  return useMutation({
    mutationFn: (credentials: {
      currentPassword: string;
      newPassword: string;
    }) => apiClient.patch("/api/v1/auth/change-password", credentials),
    onSuccess: (res) => {
      console.log("Password changed successful:", res.data);
      toast.success("Password changed successful");
    },
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};