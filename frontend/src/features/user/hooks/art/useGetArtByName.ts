import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

// ------------------ Types ------------------
export interface Price {
  type: string;       
  artcoins?: number;
  fiat?: number;
}

// user fields
export interface User {
  id: string;
  name: string;
  username: string;
  profileImage?: string;
  bannerImage?: string;
  status: string;
  isVerified: boolean;
  plan: string;
  supportersCount: number;
  supportingCount: number;
  isSupporting: boolean;
}

// art fields
export interface Art {
  id: string;
  userId: string;
  title: string;
  artName: string;
  description?: string;
  artType: string;
  hashtags: string[];
  aspectRatio?: string;
  commentingDisabled: boolean;
  downloadingDisabled: boolean;
  isPrivate: boolean;
  isForSale: boolean;
  isSensitive: boolean;
  postType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string;
}

// full response
export interface ArtWithUserResponse {
  message: string;
  data: {
    user: User;
  art: Art;
  isLiked: boolean;
  likeCount: number;
  commentCount: number;
  price: Price;
  }
}

// ------------------ Hook ------------------
export const useGetArtByName = (artname: string) => {
  return useQuery<ArtWithUserResponse, Error>({
    queryKey: ["art", artname],
    queryFn: async () => {
      const { data } = await apiClient.get<ArtWithUserResponse>(
        `/api/v1/art/by-name/${artname}`
      );
      return data;
    },
    enabled: !!artname,
  });
};
