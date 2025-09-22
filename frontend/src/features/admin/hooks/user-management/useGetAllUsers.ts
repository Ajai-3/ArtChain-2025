import apiClient from "../../../../api/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const useGetAllUsers = ({
  page,
  limit,
  search,
  role,
  plan,
  status,
}: {
  page: number;
  limit: number;
  search?: string;
  role?: string;
  plan?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: ["admin-users", page, limit, search, role, status, plan],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/admin/users", {
        params: { page, limit, role, status, plan, search },
      });
      return response.data as any;
    },
    placeholderData: keepPreviousData,
  });
};
