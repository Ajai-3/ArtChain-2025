import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export const useGetReportTarget = (targetId: string, targetType: "ART" | "COMMENT" | "USER") => {
  return useQuery({
    queryKey: ["report-target", targetType, targetId],
    queryFn: async () => {
      if (targetType === "USER") {
        const res = await apiClient.get(`/api/v1/user/profile-id/${targetId}`);
        return res.data.data;
      } else if (targetType === "ART") {
        const res = await apiClient.get(`/api/v1/art/${targetId}`); 
        return res.data.art;
      } else if (targetType === "COMMENT") {
        const res = await apiClient.get(`/api/v1/art/comment/${targetId}`);
        return res.data.comment;
      }
      return null;
    },
    enabled: !!targetId,
    retry: false,
  });
};
