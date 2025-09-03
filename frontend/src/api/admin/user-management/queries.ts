import apiClient from "../../axios";
import type { User } from "../../../types/user/user";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUsers = ({
  page,
  limit,
  search,
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["admin-users", page, search],
    queryFn: async () => {
      const response = await apiClient.get("/api/v1/admin/users", {
        params: { page, limit, search },
      });
      return response.data as any;
    },
  });
};
