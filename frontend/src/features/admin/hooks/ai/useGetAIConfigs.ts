import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetAIConfigs = () => {
  return useQuery({
    queryKey: ["admin-ai-configs"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/art/admin/ai/config");
      return response.data;
    },
  });
};
