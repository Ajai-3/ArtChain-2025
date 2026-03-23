import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import toast from 'react-hot-toast';

interface UpdateArtPostPayload {
  id: string;
  artName?: string;
  title?: string;
  description?: string;
  commentingDisabled?: boolean;
  downloadingDisabled?: boolean;
  isPrivate?: boolean;
  isSensitive?: boolean;
  isForSale?: boolean;
  priceType?: 'artcoin' | 'fiat';
  artcoins?: number;
  fiatPrice?: number;
}

export const useUpdateArtPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateArtPostPayload) => {
      const { id, ...data } = payload;
      const response = await apiClient.patch(`/api/v1/art/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allArt'] });
      queryClient.invalidateQueries({ queryKey: ['artByName'] });
      queryClient.invalidateQueries({ queryKey: ['artById'] });
      queryClient.invalidateQueries({ queryKey: ['userArt'] });
      queryClient.invalidateQueries({ queryKey: ['userArtById'] });
      queryClient.invalidateQueries({ queryKey: ['userArtByName'] });
      queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      toast.success('Art post updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update art post');
    },
  });
};
