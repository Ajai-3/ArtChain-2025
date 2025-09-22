import apiClient from "../../../../api/axios";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Category } from "../../../../types/category/category";



export interface GetAllCategoryResponse {
  success: boolean;
  message: string;
  data: Category[];
  total: number;
  page: number;
  limit: number;
}

interface UseGetAllCategoryParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  countFilter?: number;
}

export const useGetAllCategory = ({
  page,
  limit,
  search,
  status,
  countFilter,
}: UseGetAllCategoryParams) => {
  const queryKey = ["categories", page, search, status, countFilter] as const;

  return useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await apiClient.get<GetAllCategoryResponse>(
        "/api/v1/art/category",
        { params: { page, limit, search, status, count: countFilter } }
      );
      return data;
    },
    staleTime: 10000 * 60, 
    keepPreviousData: true as unknown as boolean,
  } as UseQueryOptions<GetAllCategoryResponse, Error, GetAllCategoryResponse, readonly unknown[]>);
};
