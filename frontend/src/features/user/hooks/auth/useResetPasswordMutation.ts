import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { ROUTES } from "../../../../constants/routes";

export const useResetPasswordMutation = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (credentials: { token: string; password: string }) =>
      apiClient.patch("/api/v1/auth/reset-password", credentials),
    onSuccess: (res) => {
      console.log("Password reset successful:", res.data);
      toast.success("Password reset successful, Login now.");
      navigate(ROUTES.LOGIN);
    },
    onError: (error) => {
      console.error("Password reset failed:", error);
    },
  });
};