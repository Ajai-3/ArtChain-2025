import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUserResponse } from "./useGetArtByName";

interface CommentInput {
  postId: string;
  artname: string; // must pass this
  content: string;
}

interface OnMutateContext {
  prevArt?: ArtWithUserResponse;
}

export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation<ArtWithUserResponse, Error, CommentInput, OnMutateContext>({
    mutationFn: ({ postId, content }: CommentInput) =>
      apiClient.post(`/api/v1/art/comment/`, { postId, content }),

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

      queryClient.getQueriesData<any>({ queryKey: ["allArt"] }).forEach(([key, prevAllArt]) => {
        if (!prevAllArt) return;
        const newAllArt = {
          ...prevAllArt,
          pages: prevAllArt.pages.map((page: any) => ({
            ...page,
            data: page.data.map((art: any) =>
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
