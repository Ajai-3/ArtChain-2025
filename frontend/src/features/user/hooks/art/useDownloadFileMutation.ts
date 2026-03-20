import { useMutation } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { toast } from 'react-hot-toast';

interface DownloadParams {
  id: string;
  category: 'art' | 'bidding' | 'commission';
}

export const useDownloadFileMutation = () => {
  return useMutation({
    mutationFn: ({ id, category }: DownloadParams) =>
      apiClient.get(`/api/v1/art/download/${id}`, {
        params: { type: category },
      }),

    onSuccess: (response) => {
      const { downloadUrl } = response.data.data;

      if (downloadUrl) {
        window.location.href = downloadUrl;
        toast.success('Download started!');
      }
    },
    onError: (error: any) => {
      const serverMessage = error.response?.data?.data?.error?.message;

      const message = serverMessage || error.message || 'Download failed';
      toast.error(message);
    },
  });
};
