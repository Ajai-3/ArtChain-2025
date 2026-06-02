import apiClient from "../../../../api/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { User } from "../../../../types/users/user/user";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export interface GetAllUsersResponse {
  data: User[];
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
      const response = await apiClient.get<GetAllUsersResponse>(API_ENDPOINTS.ADMIN_USERS, {
        params: { page, limit, role, status, plan, search },
      });
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
