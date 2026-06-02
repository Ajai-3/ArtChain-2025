import { useDispatch } from 'react-redux';
import apiClient from '../../../../api/axios';
import { useMutation } from '@tanstack/react-query';
import { updateProfile } from '../../../../redux/slices/userSlice';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useUpdateProfileMutation = () => {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: (credentials: {
      name?: string;
      username?: string;
      bio?: string;
      country?: string;
    }) => apiClient.patch(API_ENDPOINTS.USER_PROFILE_1, credentials),
      onSuccess: (data: { data: { user: import("../../../../types/users/user/user").User } }) => {
      toast.success('Profile updated sucessfully');
      dispatch(updateProfile({ user: data.data.user }));
    },
    onError: (error: unknown) => {
      const err = error as { message?: string };
      console.error('Profile update failed:', err);
      toast.error(err.message || "Something went wrong");
    },
  });
};
