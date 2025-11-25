import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetMyAIGenerations = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["my-ai-generations", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(`/api/v1/art/ai/generations?page=${page}&limit=${limit}`);
      return response.data;
    },
  });
};
