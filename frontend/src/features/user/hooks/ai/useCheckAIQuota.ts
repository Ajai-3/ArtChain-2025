import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useCheckAIQuota = () => {
  return useQuery({
    queryKey: ["ai-quota"],
    queryFn: async () => {
      const response = await apiClient.get(API_ENDPOINTS.ART_AI_QUOTA);
      return response.data;
    },
  });
};
