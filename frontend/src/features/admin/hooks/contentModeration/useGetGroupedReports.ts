import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

export interface GroupedReport {
  targetId: string;
  targetType: string;
  reportCount: number;
  latestReportDate: string;
  commonReason: string;
  status: string;
  reporters: Array<{
    id: string;
    username: string;
    email: string;
    profileImage: string | null;
  }>;
  reports: any[];
}

interface UseGetGroupedReportsParams {
  page: number;
  limit: number;
  status?: string;
  targetType?: string;
}

export const useGetGroupedReports = ({
  page,
  limit,
  status,
  targetType,
}: UseGetGroupedReportsParams) => {
  return useQuery({
    queryKey: ["admin-grouped-reports", page, limit, status, targetType],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (status && status !== "ALL") params.append("status", status);
      if (targetType && targetType !== "ALL") params.append("targetType", targetType);

      const response = await apiClient.get(`/api/v1/admin/reports/grouped?${params.toString()}`);
      return response.data;
    },
  });
};
