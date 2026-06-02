import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useGetReportTarget = (targetId: string, targetType: "ART" | "COMMENT" | "USER") => {
  return useQuery({
    queryKey: ["report-target", targetType, targetId],
    queryFn: async () => {
      if (targetType === "USER") {
        const res = await apiClient.get(API_ENDPOINTS.USER_PROFILEID(targetId));
        return res.data.data;
      } else if (targetType === "ART") {
        const res = await apiClient.get(API_ENDPOINTS.ART(targetId)); 
        return res.data;
      } else if (targetType === "COMMENT") {
        const res = await apiClient.get(API_ENDPOINTS.ART_COMMENT(targetId));
        return res.data.comment;
      }
      return null;
    },
    enabled: !!targetId,
    retry: false,
  });
};
