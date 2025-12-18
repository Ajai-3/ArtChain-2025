import { useQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { ROUTES } from "../../../../constants/routes";

export const useCommissionsQuery = (page: number, limit: number, status?: string) => {
  return useQuery({
    queryKey: ['admin-commissions', page, limit, status],
    queryFn: async () => {
      const response = await apiClient.get(ROUTES.ADMIN.ADMIN_COMMISSIONS, {
        params: { page, limit, status }
      });
      return response.data.data;
    }
  });
};
