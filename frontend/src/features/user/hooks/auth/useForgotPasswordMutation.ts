import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import type { ApiError } from "../../../../types/apiError";

export const useForgottPasswordMutation = (
  setFormError: (msg: string | null) => void
) => {
  return useMutation({
    mutationFn: (credentials: { identifier: string }) =>
      apiClient.post("/api/v1/auth/forgot-password", credentials),
    onSuccess: (res) => {
      console.log("Password reset request sent:", res.data);
      toast.success("Password reset request sent");
    },
    onError: (error: ApiError) => {
      setFormError(error.message);
    },
  });
};
