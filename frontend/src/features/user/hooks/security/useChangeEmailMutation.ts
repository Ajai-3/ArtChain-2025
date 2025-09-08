import { useMutation } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import type { ApiError } from "../../../../types/apiError";

export interface ChangeEmailFormData {
  currentEmail: string;
  newEmail: string;
}

interface ChangeEmailResponse {
  message: string;
}

export const useChangeEmailMutation = (
  setFormError: (msg: string | null) => void
): UseMutationResult<ChangeEmailResponse, ApiError, ChangeEmailFormData> => {
  return useMutation<ChangeEmailResponse, ApiError, ChangeEmailFormData>({
    mutationFn: async (data: ChangeEmailFormData) => {
      const res = await apiClient.post<ChangeEmailResponse>(
        "/api/v1/user/change-email",
        {
          currentEmail: data.currentEmail,
          newEmail: data.newEmail,
        }
      );
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message ?? "Email updated token sended successfully");
    },

    onError: (error: ApiError) => {
      setFormError(error.message);
    },
  });
};
