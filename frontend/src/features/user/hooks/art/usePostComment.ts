// hooks/art/usePostComment.ts
import type { AxiosResponse } from "axios";
import apiClient from "../../../../api/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CommentInput {
  postId: string;
  content: string;
}

export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation<AxiosResponse<any>, Error, CommentInput>({
    mutationFn: ({ postId, content }: CommentInput) =>
      apiClient.post(`/api/v1/art/comment/`, { postId, content }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
    onError: (error) => {
      console.error("Posting comment failed:", error);
    },
  });
};
