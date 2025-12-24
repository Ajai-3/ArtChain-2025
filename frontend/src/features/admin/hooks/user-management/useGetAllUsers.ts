import apiClient from "../../../../api/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export interface GetAllUsersResponse {
  data: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  stats: {
    total: number;
    active: number;
    banned: number;
    artists: number;
  };
}

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
      const response = await apiClient.get<GetAllUsersResponse>("/api/v1/admin/users", {
        params: { page, limit, role, status, plan, search },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
