import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';

interface CommissionConfig {
  auctionCommissionPercentage: number;
  artSaleCommissionPercentage: number;
  welcomeBonus: number;
  referralBonus: number;
  artCoinRate: number;
}

export const useCommissionConfigQuery = () => {
  return useQuery<CommissionConfig>({
    queryKey: ['commissionConfig'],
    queryFn: async () => {
      const response = await apiClient.get('/api/v1/art/admin/platform-config');
      return response.data.data;
    },
  });
};
