import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useUserArts = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["userArts", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data } = await apiClient.get(`/api/v1/art/user/${userId}`);
      return Array.isArray(data.data) ? data.data : (data.data?.data || []);
    },
    enabled: !!userId,
  });
};
