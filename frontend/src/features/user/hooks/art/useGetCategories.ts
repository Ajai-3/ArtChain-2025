// hooks/art/useGetCategories.ts
import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export interface Category {
  id: string;
  _id?: string;
  name: string;
  status: string;
  count: number;
}

export const useGetCategories = () => {
  return useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient.get(API_ENDPOINTS.ART_CATEGORY, {
        params: { page: 1, limit: 50 },
      });
      return res.data.data as Category[];
    },
    refetchOnWindowFocus: false,
  });
};