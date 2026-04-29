import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import toast from 'react-hot-toast';
import type { ArtistRequestPayload } from '../../../../types/art/artistRequestPayload';

export const useCreateArtistRequestMutation = () => {
  return useMutation({
    mutationFn: (data: ArtistRequestPayload) =>
      apiClient.post('/api/v1/user/artist-request', data),
    onError: (error: unknown) => {
      const err = error as { message?: string };
      toast.error(err?.message || 'Something went wrong!');
    },
  });
};
