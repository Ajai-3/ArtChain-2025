import { useMutation } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import toast from 'react-hot-toast';
import type { ApiError } from '../../../../types/apiError';
import { updateProfile } from '../../../../redux/slices/userSlice';
import { useDispatch } from 'react-redux';
import type { User } from '../../../../types/users/user/user';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export interface VerifyEmailTokenFormData {
  token: string;
}

interface VerifyEmailTokenResponse {
  message: string;
  data: User;
}

export const useVerifyEmailTokenMutation = (
  setFormError: (msg: string | null) => void,
): UseMutationResult<
  VerifyEmailTokenResponse,
  ApiError,
  VerifyEmailTokenFormData
> => {
  const dispatch = useDispatch();
  return useMutation<
    VerifyEmailTokenResponse,
    ApiError,
    VerifyEmailTokenFormData
  >({
    mutationFn: async (data: VerifyEmailTokenFormData) => {
      const res = await apiClient.post<VerifyEmailTokenResponse>(
        API_ENDPOINTS.USER_VERIFYEMAILTOKEN,
        { token: data.token },
      );
      return res.data;
    },

    onSuccess: (data) => {
      toast.success(data.message || 'Email changed successfully');
      if (data.data) {
        dispatch(updateProfile({ user: data.data }));
      }
    },

    onError: (error: ApiError) => {
      setFormError(error.message);
    },
  });
};
