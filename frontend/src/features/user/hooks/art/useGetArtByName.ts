import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

// ------------------ Types ------------------
export interface Price {
  type: string;        // "artcoins" | "fiat"
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
  price?: Price;
}

// full response
export interface ArtWithUserResponse {
  message: string;
  data: {
    user: User;
  art: Art;
  }
}

// ------------------ Hook ------------------
export const useGetArtByName = (artname: string) => {
  return useQuery<ArtWithUserResponse, Error>({
    queryKey: ["art", artname],
    queryFn: async () => {
      const { data } = await apiClient.get<ArtWithUserResponse>(
        `/api/v1/art/${artname}`
      );
      return data;
    },
    enabled: !!artname,
  });
};
