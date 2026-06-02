import apiClient from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '../../../../redux/slices/userSlice';
import type { ApiError } from '../../../../types/apiError';
import { ROUTES } from '../../../../constants/routes';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useLogoutMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiClient.post(API_ENDPOINTS.AUTH_LOGOUT),
    onSuccess: (res) => {
      dispatch(logout());
      queryClient.clear();
      navigate(ROUTES.LOGIN);
      toast.success('Logout successful');
    },
    onError: (error: ApiError) => {
      toast.error('Logout failed');
    },
  });
};
