import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import type { ArtWithUser } from "./useGetAllArt";

interface LikeVariables {
  postId: string;
  artname: string;
}

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId }: LikeVariables) => {
      const { data } = await apiClient.post("/api/v1/art/like", { postId });
      return data;
    },
    onMutate: ({ postId, artname }: LikeVariables) => {
      // Single art update
      const previousArtData = queryClient.getQueryData(["art", artname]);
      if (previousArtData) {
        queryClient.setQueryData(["art", artname], {
          ...previousArtData,
          data: {
            ...previousArtData?.data,
            isLiked: true,
            likeCount: previousArtData?.data.likeCount + 1,
          },
        });
      }

      // Infinite allArt update
      const previousAllArt = queryClient.getQueryData<any>(["allArt"]);
      if (previousAllArt) {
        const newAllArt = {
          ...previousAllArt,
          pages: previousAllArt.pages.map((page: any) => ({
            ...page,
            data: page.data.map((art: ArtWithUser) =>
              art.art.id === postId
                ? { ...art, isLiked: true, likeCount: art.likeCount + 1 }
                : art
            ),
          })),
        };
        queryClient.setQueryData(["allArt"], newAllArt);
      }

      return { previousArtData, previousAllArt };
    },
    onError: (_, __, context) => {
      if (context?.previousArtData) {
        queryClient.setQueryData(["art"], context.previousArtData);
      }
      if (context?.previousAllArt) {
        queryClient.setQueryData(["allArt"], context.previousAllArt);
      }
    },
  });
};