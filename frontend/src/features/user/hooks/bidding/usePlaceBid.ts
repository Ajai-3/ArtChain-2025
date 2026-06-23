import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';
import type { ApiError } from '../../../../types/apiError';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const usePlaceBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      auctionId,
      amount,
    }: {
      auctionId: string;
      amount: number;
    }) => apiClient.post(API_ENDPOINTS.ART_BIDS_1, { auctionId, amount }),
    onSuccess: (data, variables) => {
      toast.success('Bid placed successfully!');
      queryClient.invalidateQueries({
        queryKey: ['auction', variables.auctionId],
      });
      // queryClient.invalidateQueries({ queryKey: ["auctions"] });
      queryClient.invalidateQueries({ queryKey: ['wallet'] });
    },
    onError: (error: AxiosError<ApiError>) => {
      toast.error(error.response?.data?.message || 'Failed to place bid');
    },
  });
};
