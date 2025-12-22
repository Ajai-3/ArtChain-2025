import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { ROUTES } from '../../../../constants/routes';

interface CommissionConfig {
  auctionCommissionPercentage: number;
  artSaleCommissionPercentage: number;
  commissionArtPercentage: number;
  welcomeBonus: number;
  referralBonus: number;
  artCoinRate: number;
}

export const useCommissionConfigQuery = () => {
  return useQuery<CommissionConfig>({
    queryKey: ['commissionConfig'],
    queryFn: async () => {
      const response = await apiClient.get(ROUTES.ADMIN.PLATFORM_CONFIG);
      return response.data.data;
    },
  });
};
