import apiClient from "../../../../api/axios";
import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

interface ArtistRequest {
  id: string;
  name: string;
  email: string;
  username: string;
  profileImage: string;
  createdAt: string;
  status: string;
}

interface ArtistRequestsResponse {
  requests: ArtistRequest[];
  total: number;
  page: number;
  limit: number;
}

export const useGetArtistRequests = (
  page: number,
  limit: number,
  options?: Omit<
    UseQueryOptions<ArtistRequestsResponse, Error>,
    "queryKey" | "queryFn"
  >
) => {
  return useQuery<ArtistRequestsResponse, Error>({
    queryKey: ["artistRequests", page, limit],
      queryFn: async () => {
        const { data } = await apiClient.get(
          API_ENDPOINTS.ADMIN_GETARTISTREQUESTSPAGE(page, limit)
        );
        return {
          requests: data.result.data.map((req: { id: string; user: { name: string; email: string; username: string; profileImage: string }; status: string; createdAt: string }) => ({
          id: req.id,
          name: req.user.name,
          email: req.user.email,
          profileImage: req.user.profileImage,
          username: req.user.username,
          createdAt: req.createdAt,
          status: req.status,
        })),
        total: data.result.meta.total,
        page: data.result.meta.page,
        limit: data.result.meta.limit,
      };
    },
    ...options,
  });
};
