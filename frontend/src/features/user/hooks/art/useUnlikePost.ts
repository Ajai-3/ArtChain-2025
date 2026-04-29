import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUser } from "./useGetAllArt";
import type { PaginationPage } from "../../../../types/apiResponses";

interface LikeVariables {
  postId: string;
  artname: string;
}

interface OnMutateContext {
  prevArt?: { data: { isLiked: boolean; likeCount: number } };
}
export const useUnlikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: LikeVariables) => {
      const { data } = await apiClient.delete("/api/v1/art/unlike", {
        data: { postId },
      });
      return data;
    },

    onMutate: ({ postId, artname }: LikeVariables) => {
      // Update single art
      const prevArt = queryClient.getQueryData<{
        data: { isLiked: boolean; likeCount: number };
      }>(["art", artname]);
      if (prevArt) {
        queryClient.setQueryData(["art", artname], {
          ...prevArt,
          data: {
            ...prevArt.data,
            isLiked: false,
            likeCount: prevArt.data.likeCount - 1,
          },
        });
      }

      // Update all "allArt" queries
      queryClient
        .getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["allArt"] })
        .forEach(([key, prevAllArt]) => {
          if (!prevAllArt) return;
          const newAllArt = {
            ...prevAllArt,
            pages: prevAllArt.pages.map((page) => ({
              ...page,
              data: page.data.map((art) =>
                art.art.id === postId
                  ? { ...art, isLiked: false, likeCount: art.likeCount - 1 }
                  : art
              ),
            })),
          };
          queryClient.setQueryData(key, newAllArt);
        });

      // Update userGallery queries
      queryClient
        .getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["userGallery"] })
        .forEach(([key, prevUserArt]) => {
          if (!prevUserArt) return;
          const newUserArt = {
            ...prevUserArt,
            pages: prevUserArt.pages.map((page) => ({
              ...page,
              data: page.data.map((art) =>
                art.art.id === postId
                  ? { ...art, isLiked: false, likeCount: art.likeCount - 1 }
                  : art
              ),
            })),
          };
          queryClient.setQueryData(key, newUserArt);
        });

      queryClient
        .getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["userFavorites"] })
        .forEach(([key, prevUserArt]) => {
          if (!prevUserArt) return;
          const newUserArt = {
            ...prevUserArt,
            pages: prevUserArt.pages.map((page) => ({
              ...page,
              data: page.data.map((art) =>
                art.art.id === postId
                  ? { ...art, isLiked: false, likeCount: art.likeCount - 1 }
                  : art
              ),
            })),
          };
          queryClient.setQueryData(key, newUserArt);
        });

      queryClient
        .getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["userLikedArts"] })
        .forEach(([key, prevLikedArts]) => {
          if (!prevLikedArts) return;

          const newLikedArts = {
            ...prevLikedArts,
            pages: prevLikedArts.pages.map((page) => ({
              ...page,
              data: page.data.filter((art) => art.art.id !== postId)
            })),
          };

          queryClient.setQueryData(key, newLikedArts);
        });

      return { prevArt } as OnMutateContext;
    },
  });
};
