import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUser } from "./useGetAllArt";

interface LikeVariables {
  postId: string;
  artname: string;
}

interface OnMutateContext {
  prevArt?: { data: { isLiked: boolean; likeCount: number } };
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: LikeVariables) => {
      const { data } = await apiClient.post("/api/v1/art/like", { postId });
      return data;
    },

    onMutate: ({ postId, artname }: LikeVariables) => {
      const prevArt = queryClient.getQueryData<{ data: { isLiked: boolean; likeCount: number } }>(["art", artname]);

      if (prevArt) {
        queryClient.setQueryData(["art", artname], {
          ...prevArt,
          data: {
            ...prevArt.data,
            isLiked: true,
            likeCount: prevArt.data.likeCount + 1,
          },
        });
      }

      queryClient.getQueriesData<any>({ queryKey: ["allArt"] }).forEach(([key, prevAllArt]) => {
        if (!prevAllArt) return;

        const newAllArt = {
          ...prevAllArt,
          pages: prevAllArt.pages.map((page: any) => ({
            ...page,
            data: page.data.map((art: ArtWithUser) =>
              art.art.id === postId
                ? { ...art, isLiked: true, likeCount: art.likeCount + 1 }
                : art
            ),
          })),
        };

        queryClient.setQueryData(key, newAllArt);
      });

      queryClient.getQueriesData<any>({ queryKey: ["userGallery"] }).forEach(([key, prevUserArt]) => {
        if (!prevUserArt) return;
        const newUserArt = {
          ...prevUserArt,
          pages: prevUserArt.pages.map((page: any) => ({
            ...page,
            data: page.data.map((art: ArtWithUser) =>
              art.art.id === postId
                ? { ...art, isLiked: true, likeCount: art.likeCount + 1 }
                : art
            ),
          })),
        };
        queryClient.setQueryData(key, newUserArt);
      });


      return { prevArt } as OnMutateContext;
    },
  });
};
