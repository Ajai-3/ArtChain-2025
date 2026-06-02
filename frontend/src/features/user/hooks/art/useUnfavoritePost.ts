import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUser } from "./useGetAllArt";
import type { PaginationPage } from "../../../../types/apiResponses";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface FavoriteVariables {
  postId: string;
  artname: string;
}

interface OnMutateContext {
  prevArt?: { data: { isFavorited: boolean; favoriteCount: number } };
}

export const useUnfavoritePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: FavoriteVariables) => {
      const { data } = await apiClient.delete(API_ENDPOINTS.ART_UNFAVORITE, {
        data: { postId },
      });
      return data;
    },

    onMutate: ({ postId, artname }: FavoriteVariables) => {
      const prevArt = queryClient.getQueryData<{
        data: { isFavorited: boolean; favoriteCount: number };
      }>(["art", artname]);

      if (prevArt) {
        queryClient.setQueryData(["art", artname], {
          ...prevArt,
          data: {
            ...prevArt.data,
            isFavorited: false,
            favoriteCount: Math.max(0, (prevArt.data.favoriteCount || 1) - 1),
          },
        });
      }

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
                  ? {
                    ...art,
                    isFavorited: false,
                    favoriteCount: Math.max(0, (art.favoriteCount || 1) - 1),
                  }
                  : art
              ),
            })),
          };

          queryClient.setQueryData(key, newAllArt);
        });

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
                  ? {
                    ...art,
                    isFavorited: false,
                    favoriteCount: Math.max(0, (art.favoriteCount || 1) - 1),
                  }
                  : art
              ),
            })),
          };
          queryClient.setQueryData(key, newUserArt);
        });

      queryClient
        .getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["userFavorites"] })
        .forEach(([key, prevData]) => {
          if (!prevData) return;

          const newData = {
            ...prevData,
            pages: prevData.pages.map((page) => ({
              ...page,
              data: page.data.map((art) =>
                art.art.id === postId
                  ? {
                    ...art,
                    isFavorited: false,
                    favoriteCount: Math.max(0, (art.favoriteCount || 1) - 1),
                  }
                  : art
              ),
            })),
          };

          queryClient.setQueryData(key, newData);
        });

      // Inside useUnfavoritePost -> onMutate
      queryClient
        .getQueriesData<{ pages: PaginationPage<ArtWithUser>[] }>({ queryKey: ["userLikedArts"] })
        .forEach(([key, prevLikedArts]) => {
          if (!prevLikedArts) return;
          const newLikedArts = {
            ...prevLikedArts,
            pages: prevLikedArts.pages.map((page) => ({
              ...page,
              data: page.data.map((art) =>
                art.art.id === postId
                  ? {
                    ...art,
                    isFavorited: false,
                    favoriteCount: Math.max(0, (art.favoriteCount || 1) - 1)
                  }
                  : art
              ),
            })),
          };
          queryClient.setQueryData(key, newLikedArts);
        });

      return { prevArt } as OnMutateContext;
    },
  });
};
