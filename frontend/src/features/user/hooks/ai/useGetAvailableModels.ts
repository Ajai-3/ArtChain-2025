import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetAvailableModels = () => {
  return useQuery({
    queryKey: ["available-ai-models"],
    queryFn: async () => {
      // Get enabled AI configs
      const response = await apiClient.get(API_ENDPOINTS.ART_AI_CONFIG);
      return response.data?.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
