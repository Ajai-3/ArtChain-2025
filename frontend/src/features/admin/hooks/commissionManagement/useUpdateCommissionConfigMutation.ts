import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../../../constants/routes';

interface CommissionConfig {
  auctionCommissionPercentage: number;
  artSaleCommissionPercentage: number;
  commissionArtPercentage: number;
  welcomeBonus: number;
  referralBonus: number;
  artCoinRate: number;
}

export const useUpdateCommissionConfigMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CommissionConfig>) => {
      const response = await apiClient.patch(ROUTES.ADMIN.PLATFORM_CONFIG, data);
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
