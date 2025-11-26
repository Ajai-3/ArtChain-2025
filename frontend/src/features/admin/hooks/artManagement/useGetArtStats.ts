import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetArtStats = () => {
  return useQuery({
    queryKey: ["admin-art-stats"],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/art/admin/art/stats");
      return response.data;
    },
  });
};
