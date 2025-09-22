import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export interface ArtUser {
  id: string;
  username: string;
  name: string;
  email: string;
  profileImage?: string;
  plan?: "free" | "pro" | "pro_plus";
  role?: "admin" | "user" | "artist";
  status?: "active" | "banned" | "suspended" | "deleted";
}

export interface ArtPostResponseDTO {
  id: string; 
  userId: string;
  title: string;
  description: string;
  artType: string;
  hashtags: string[];
  artName: string;
  imageUrl: string;
  aspectRatio: string;
  isForSale: boolean;
  priceType?: "artcoin" | "fiat";
  artcoins?: number;
  fiatPrice?: number;
  postType: "original" | "repost" | "purchased";
  createdAt: string;
  updatedAt: string;
}

export interface ArtWithUser {
  art: ArtPostResponseDTO;
  user: ArtUser | null;
}

export interface PaginatedResponse {
  message: string;
  page: number;
  limit: number;
  data: ArtWithUser[];
}


export const useGetAllArt = () => {
  return useInfiniteQuery<PaginatedResponse, Error>({
    queryKey: ["allArt"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await apiClient.get("/api/v1/art", {
        params: { page: pageParam, limit: 15 },
      });
      return res.data as PaginatedResponse;
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.length < 10 ? undefined : lastPage.page + 1,
    initialPageParam: 1,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};
