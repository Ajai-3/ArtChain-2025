import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../../../../api/axios';
import { toast } from 'react-hot-toast';
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useEditCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => apiClient.put(API_ENDPOINTS.ART_COMMENTS_1(commentId), { content }),
    onSuccess: () => {
      toast.success('Comment edited successfully');
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
    onError: () => {
      toast.error('Failed to edit comment');
    },
  });
};
