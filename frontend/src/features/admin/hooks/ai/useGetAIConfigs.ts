import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetAIConfigs = () => {
  return useQuery({
    queryKey: ["admin-ai-configs"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ART_ADMIN_AI_CONFIG);
      return response.data;
    },
  });
};
