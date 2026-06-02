import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUser } from "./useGetAllArt";
import type { PaginationPage } from "../../../../types/apiResponses";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

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
      const { data } = await apiClient.post(API_ENDPOINTS.ART_LIKE, { postId });
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

      queryClient.getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["allArt"] }).forEach(([key, prevAllArt]) => {
        if (!prevAllArt) return;

        const newAllArt = {
          ...prevAllArt,
          pages: prevAllArt.pages.map((page) => ({
            ...page,
            data: page.data.map((art) =>
              art.art.id === postId
                ? { ...art, isLiked: true, likeCount: art.likeCount + 1 }
                : art
            ),
          })),
        };

        queryClient.setQueryData(key, newAllArt);
      });

      queryClient.getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["userGallery"] }).forEach(([key, prevUserArt]) => {
        if (!prevUserArt) return;
        const newUserArt = {
          ...prevUserArt,
          pages: prevUserArt.pages.map((page: PaginationPage<ArtWithUser>) => ({
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

      queryClient.getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["userFavorites"] }).forEach(([key, prevUserArt]) => {
        if (!prevUserArt) return;
        const newUserArt = {
          ...prevUserArt,
          pages: prevUserArt.pages.map((page: PaginationPage<ArtWithUser>) => ({
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userLikedArts"] });
    },
  });
};
