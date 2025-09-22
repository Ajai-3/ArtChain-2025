import apiClient from "../../../../api/axios";
import { useQuery } from "@tanstack/react-query";

export interface ArtCategory {
  _id: string;
  name: string;
  status: string;
}

interface ArtCategoryResponse {
  data: ArtCategory[];
  total: number;
}

export const useFetchArtCategories = () => {
  return useQuery<ArtCategoryResponse>({
    queryKey: ["art-categories"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/art/category?status=active&limit=100");
      return response.data; 
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};
