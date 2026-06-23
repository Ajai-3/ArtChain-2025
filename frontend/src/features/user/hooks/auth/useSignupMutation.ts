import toast from 'react-hot-toast';
import apiClient from '../../../../api/axios';
import { useMutation } from '@tanstack/react-query';
import type { ApiError } from '../../../../types/apiError';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useSignupMutation = (
  setFormError: (msg: string | null) => void,
) => {
  return useMutation({
    mutationFn: (credentials: {
      name: string;
      username: string;
      email: string;
    }) => apiClient.post(API_ENDPOINTS.AUTH_STARTREGISTER, credentials),
    onSuccess: (res) => {
      toast.success('Verification email sended');
    },
    onError: (error: ApiError) => {
      setFormError(error.message);
    },
  });
};
