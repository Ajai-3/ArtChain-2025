import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetMyAIGenerations = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["my-ai-generations", page, limit],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ART_AI_GENERATIONSPAGE(page, limit));
      return response.data;
    },
  });
};
