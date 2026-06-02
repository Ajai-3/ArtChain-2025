import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetAIAnalytics = () => {
  return useQuery({
    queryKey: ["admin-ai-analytics"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ART_ADMIN_AI_ANALYTICS);
      return response.data;
    },
  });
};
