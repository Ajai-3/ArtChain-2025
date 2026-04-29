import { useEffect } from 'react';
import apiClient from '../api/axios';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { setUser } from '../redux/slices/userSlice';
import { setAdmin } from '../redux/slices/adminSlice';
import { type AuthInitializeResponse } from '../types/AuthInitializeResponse';
import { useGetPlatformConfig } from '../features/user/hooks/platform/useGetPlatformConfig';

export const useAuthInitialization = () => {
  const dispatch = useDispatch();
  useGetPlatformConfig();

  const { data, isLoading, isFetching } = useQuery<AuthInitializeResponse>({
    queryKey: ['auth', 'initialize'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/auth/initialize', {
        _noRetry: true,
      });
      return response.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
  });

  useEffect(() => {
    if (data && !isLoading) {
      const { accessToken, user } = data;

      if (user.role === 'admin') {
        dispatch(setAdmin({ accessToken, admin: user }));
      }

      dispatch(setUser({ accessToken, user }));
    }
  }, [data, isLoading, dispatch]);

  return { loading: isLoading || isFetching };
};
