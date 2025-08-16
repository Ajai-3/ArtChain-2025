import apiClient from "../../axios";
import type { User } from "../../../types/user";
import { useQuery } from "@tanstack/react-query";

type UsersApiResponse = {
  success: boolean;
  message: string;
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export const useGetAllUsers = (options?: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  return useQuery<UsersApiResponse, Error>({
    queryKey: ["users", options],
    queryFn: async () => {
      const response = await apiClient.get<UsersApiResponse>("/api/v1/admin/users", {
        params: {
          page: options?.page || 1,
          limit: options?.limit || 10,
          search: options?.search,
          sortBy: options?.sortBy,
          sortOrder: options?.sortOrder,
        },
      })

      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });
};