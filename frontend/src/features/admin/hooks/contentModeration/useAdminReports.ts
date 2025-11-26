import apiClient from "../../../../api/axios";
import { useQuery } from "@tanstack/react-query";

export interface Report {
  id: string;
  reporterId: string;
  targetId: string;
  targetType: "ART" | "COMMENT" | "USER";
  reason: string;
  description: string | null;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: string;
  updatedAt: string;
  reporter: {
    id: string;
    username: string;
    email: string;
    profileImage: string | null;
  };
}



interface UseAdminReportsParams {
  page: number;
  limit: number;
  status?: string;
  targetType?: string;
}

interface PaginatedReportsResponse {
  message: string;
  data: Report[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
}

export const useAdminReports = (params: UseAdminReportsParams) => {
  return useQuery({
    queryKey: ["admin-reports", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("page", params.page.toString());
      queryParams.append("limit", params.limit.toString());
      
      if (params.status && params.status !== "ALL") {
        queryParams.append("status", params.status);
      }
      if (params.targetType && params.targetType !== "ALL") {
        queryParams.append("targetType", params.targetType);
      }

      const { data } = await apiClient.get<PaginatedReportsResponse>(
        `/api/v1/admin/reports?${queryParams.toString()}`
      );
      return data;
    },
  });
};
