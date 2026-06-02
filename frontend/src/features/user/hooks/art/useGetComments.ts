import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export interface Comment {
  _id: string;
  content: string;
  name: string;
  userId: string;
  postid: string;
  userName: string;
  createdAt: string;
  updatedAt: string;
  profileImage: string;
  role?: string;
  isVerified?: boolean;
  replyToId?: string;
}

export interface CommentPage {
  comments: Comment[];
}

export const useGetComments = (postId: string, limit = 5) => {
  return useInfiniteQuery<CommentPage, Error>({
    queryKey: ["comments", postId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get(API_ENDPOINTS.ART_COMMENTS_2(postId), {
        params: { page: pageParam, limit },
      });

      return {
        comments: res.data.data as Comment[],
      };
    },
    getNextPageParam: (lastPage, allPages) =>
      lastPage.comments.length < limit ? undefined : allPages.length + 1,
    initialPageParam: 1,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};
