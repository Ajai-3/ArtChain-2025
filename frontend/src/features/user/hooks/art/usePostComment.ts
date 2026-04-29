import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUserResponse } from "./useGetArtByName";
import type { ArtWithUser } from "./useGetAllArt";
import type { PaginationPage } from "../../../../types/apiResponses";

interface CommentInput {
  postId: string;
  artname: string; // must pass this
  content: string;
  replyToId?: string;
}

interface OnMutateContext {
  prevArt?: ArtWithUserResponse;
}

export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation<ArtWithUserResponse, Error, CommentInput, OnMutateContext>({
    mutationFn: ({ postId, content, replyToId }: CommentInput) =>
      apiClient.post(`/api/v1/art/comment/`, { postId, content, replyToId }),

    onMutate: async ({ postId, artname }) => {
      await queryClient.cancelQueries({ queryKey: ["art", artname] });

      const prevArt = queryClient.getQueryData<ArtWithUserResponse>(["art", artname]);

      if (prevArt) {
        queryClient.setQueryData<ArtWithUserResponse>(["art", artname], {
          ...prevArt,
          data: {
            ...prevArt.data,
            commentCount: prevArt.data.commentCount + 1,
          },
        });
      }

      queryClient.getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["allArt"] }).forEach(([key, prevAllArt]) => {
        if (!prevAllArt) return;
        const newAllArt = {
          ...prevAllArt,
          pages: prevAllArt.pages.map((page) => ({
            ...page,
            data: page.data.map((art) =>
              art.art.id === postId
                ? { ...art, commentCount: art.commentCount + 1 }
                : art
            ),
          })),
        };
        queryClient.setQueryData(key, newAllArt);
      });

      return { prevArt };
    },

    onError: (err, variables, context) => {
      if (context?.prevArt) {
        queryClient.setQueryData(["art", variables.artname], context.prevArt);
      }
      console.error("Posting comment failed:", err);
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["comments", variables.postId] });
    },
  });
};
