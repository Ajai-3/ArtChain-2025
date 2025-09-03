import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import type { ApiError } from "../../../../types/apiError";
import type { ChangePasswordFormData } from "../../schemas/changePasswordSchema";
import type { AxiosResponse } from "axios";

interface ChangePasswordResponse {
  message: string;
}

export const useChangePasswordMutation = (
  setFormError: (msg: string | null) => void
): UseMutationResult<
  ChangePasswordResponse,
  ApiError,
  ChangePasswordFormData
> => {
  return useMutation<ChangePasswordResponse, ApiError, ChangePasswordFormData>({
    mutationFn: async (data: ChangePasswordFormData) => {
      const res: AxiosResponse<ChangePasswordResponse> = await apiClient.post(
        "/api/v1/user/change-password",
        {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
          logout: data.logout,
        }
      );
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message ?? "Password updated successfully");
    },
    onError: (error: ApiError) => {
      setFormError(error.message);
    },
  });
};
