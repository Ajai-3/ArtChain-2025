import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { toast } from 'react-hot-toast';

interface CommissionConfig {
  auctionCommissionPercentage: number;
  artSaleCommissionPercentage: number;
  welcomeBonus: number;
  referralBonus: number;
  artCoinRate: number;
}

export const useUpdateCommissionConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CommissionConfig>) => {
      const response = await apiClient.patch('/api/v1/art/admin/platform-config', data);
      return response.data.data;
    },
    onSuccess: (data) => {
      // Update cache directly instead of refetching
      queryClient.setQueryData(['commissionConfig'], data);
      toast.success('Commission settings updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update commission settings');
    },
  });
};
