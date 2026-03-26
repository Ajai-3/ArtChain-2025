import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import toast from 'react-hot-toast';
import type { ApiError } from '../../../../types/apiError';
import type { AxiosError } from 'axios';

export const useLockCommissionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      commissionId,
      amount,
    }: {
      userId: string;
      commissionId: string;
      amount: number;
    }) => {
      const response = await apiClient.post(
        `/api/v1/wallet/transaction/commission/lock`,
        {
          userId,
          commissionId,
          amount,
        },
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commission'] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
      toast.success('Funds locked and commission started!');
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error?.response?.data?.message || 'Failed to lock funds');
    },
  });
};
