import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useCheckAIQuota = () => {
  return useQuery({
    queryKey: ["ai-quota"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/art/ai/quota");
      return response.data;
    },
  });
};
