import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import type {
  AuctionListResponse,
  AdminAuctionData,
} from '../../../../types/auctionAdmin';

export const useSettleAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(
        `/api/v1/art/admin/auctions/${id}/settle`,
      );
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueriesData(
        { queryKey: ['admin-auctions'] },
        (oldData: AuctionListResponse | undefined) => {
          if (!oldData || !oldData.data || !oldData.data.auctions)
            return oldData;

          return {
            ...oldData,
            data: {
              ...oldData.data,
              auctions: oldData.data.auctions.map((auction) => {
                const currentId =
                  (auction as AdminAuctionData)._id || auction.id;

                if (currentId === id) {
                  return {
                    ...auction,
                    status: 'ENDED',
                    paymentStatus: 'SUCCESS',
                  };
                }
                return auction;
              }),
            },
          };
        },
      );

      queryClient.invalidateQueries({ queryKey: ['admin-auctions'] });
      toast.success('Auction funds settled successfully');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to settle auction');
    },
  });
};
