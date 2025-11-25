import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetAvailableModels = () => {
  return useQuery({
    queryKey: ["available-ai-models"],
    queryFn: async () => {
      // Get enabled AI configs
      const response = await apiClient.get("/api/v1/art/ai/config");
      return response.data?.data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
