import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUser } from "./useGetAllArt";

interface FavoriteVariables {
  postId: string;
  artname: string;
}

interface OnMutateContext {
  prevArt?: { data: { isFavorited: boolean; favoriteCount: number } };
}

export const useFavoritePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: FavoriteVariables) => {
      const { data } = await apiClient.post("/api/v1/art/favorite", { postId });
      return data;
    },

    onMutate: ({ postId, artname }: FavoriteVariables) => {
      const prevArt = queryClient.getQueryData<{ data: { isFavorited: boolean; favoriteCount: number } }>(["art", artname]);

      if (prevArt) {
        queryClient.setQueryData(["art", artname], {
          ...prevArt,
          data: {
            ...prevArt.data,
            isFavorited: true,
            favoriteCount: (prevArt.data.favoriteCount || 0) + 1,
          },
        });
      }

      // Update all "allArt" queries
      queryClient.getQueriesData<any>({ queryKey: ["allArt"] }).forEach(([key, prevAllArt]) => {
        if (!prevAllArt) return;

        const newAllArt = {
          ...prevAllArt,
          pages: prevAllArt.pages.map((page: any) => ({
            ...page,
            data: page.data.map((art: ArtWithUser) =>
              art.art.id === postId
                ? { ...art, isFavorited: true, favoriteCount: (art.favoriteCount || 0) + 1 }
                : art
            ),
          })),
        };

        queryClient.setQueryData(key, newAllArt);
      });

      return { prevArt } as OnMutateContext;
    },
  });
};
