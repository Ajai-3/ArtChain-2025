import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
export interface ActualUser {
  id: string;
  name: string;
  profileImage?: string;
  [key: string]: any;
}

export interface UserDataWrapper {
  user: ActualUser;
  supportersCount: number;
  isSupporting: boolean;
}

export interface UserResponse {
  data: UserDataWrapper;
  message: string;
}

export interface Art {
  _id: string;
  title: string;
  description?: string;
  previewUrl: string;
  userId: string;
  [key: string]: any;
}

export interface ArtResponse {
  message: string;
  art: Art;
  user: UserResponse;
}
// Correct useQuery for React Query v4
export const useGetArtById = (id: string) => {
  return useQuery<ArtResponse, Error>({
    queryKey: ["art", id],
    queryFn: async () => {
      const { data } = await apiClient.get<ArtResponse>(`/api/v1/art/${id}`);
      return data;
    },
    enabled: !!id, // only fetch if id exists
  });
};
