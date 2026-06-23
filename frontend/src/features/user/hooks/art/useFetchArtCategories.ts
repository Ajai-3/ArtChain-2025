import apiClient from "../../../../api/axios";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

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
      const response = await apiClient.get(API_ENDPOINTS.ART_CATEGORYSTATUSACTIVELIMIT100);
      return response.data; 
    },
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
};
