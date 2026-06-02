import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import apiClient from '../../../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { adminLogout } from '../../../../redux/slices/adminSlice';
import { ROUTES } from '../../../../constants/routes';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useAdminLogoutMutation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => apiClient.post(API_ENDPOINTS.ADMIN_LOGOUT),
    onSuccess: () => {
      toast.success('Logout successful');
      dispatch(adminLogout());
      navigate(ROUTES.ADMIN_LOGIN);
    },
    onError: (error: unknown) => {
      toast.error(
        `Logout failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      dispatch(adminLogout());
      navigate(ROUTES.ADMIN_LOGIN);
    },
  });
};
