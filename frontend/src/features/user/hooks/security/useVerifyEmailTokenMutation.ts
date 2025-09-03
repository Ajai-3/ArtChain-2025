// hooks/security/useVerifyEmailTokenMutation.ts
import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import type { ApiError } from "../../../../types/apiError";

export interface VerifyEmailTokenFormData {
  token: string;
}

interface VerifyEmailTokenResponse {
  message: string;
}

export const useVerifyEmailTokenMutation = (
  setFormError: (msg: string | null) => void
): UseMutationResult<VerifyEmailTokenResponse, ApiError, VerifyEmailTokenFormData> => {
  return useMutation<VerifyEmailTokenResponse, ApiError, VerifyEmailTokenFormData>({
    mutationFn: async (data: VerifyEmailTokenFormData) => {
      const res = await apiClient.post<VerifyEmailTokenResponse>(
        "/api/v1/user/verify-email-token",
        { token: data.token }
      );
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || "Email changed successfully");
    },

    onError: (error: ApiError) => {
      setFormError(error.message);
    },
  });
};
