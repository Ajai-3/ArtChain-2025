import { useEffect, useState } from 'react';
import apiClient from '../api/axios';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { setUser } from '../redux/slices/userSlice';
import { setAdmin } from '../redux/slices/adminSlice';
import { type AuthInitializeResponse } from '../types/AuthInitializeResponse';
import { useGetPlatformConfig } from '../features/user/hooks/platform/useGetPlatformConfig';
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const useAuthInitialization = () => {
  const dispatch = useDispatch();
  useGetPlatformConfig();
  const [isInitialized, setIsInitialized] = useState(false);

  const { data, isLoading } = useQuery<AuthInitializeResponse>({
    queryKey: ['auth', 'initialize'],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.AUTH_INITIALIZE, {
        _noRetry: true,
      });
      return response.data;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (data) {
        const { accessToken, user } = data;

        if (user.role === 'admin') {
          dispatch(setAdmin({ accessToken, admin: user }));
        }

        dispatch(setUser({ accessToken, user }));
      }
      setIsInitialized(true);
    }
  }, [data, isLoading, dispatch]);

  return { loading: !isInitialized };
};
