import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useCancelAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(
        API_ENDPOINTS.ART_ADMIN_AUCTIONS(id),
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueriesData(
        { queryKey: ['admin-auctions'] },
        (
          oldData:
            | {
                data?: {
                  auctions?: Array<{
                    _id?: string;
                    id: string;
                    status: string;
                  }>;
                };
              }
            | undefined,
        ) => {
          if (!oldData || !oldData.data || !oldData.data.auctions)
            return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              auctions: oldData.data.auctions.map((auction) => {
                if (auction._id === id || auction.id === id) {
                  return { ...auction, status: 'CANCELLED' };
                }
                return auction;
              }),
            },
          };
        },
      );
      toast.success('Auction cancelled successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Failed to cancel auction');
    },
  });
};
