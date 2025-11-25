import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetAIAnalytics = () => {
  return useQuery({
    queryKey: ["admin-ai-analytics"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/art/admin/ai/analytics");
      return response.data;
    },
  });
};
