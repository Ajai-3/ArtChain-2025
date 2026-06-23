import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useUserArts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userArts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await apiClient.get(API_ENDPOINTS.ART_USER(userId));
      return Array.isArray(data.data) ? data.data : (data.data?.data || []);
    },
    enabled: !!userId,
  });
};
