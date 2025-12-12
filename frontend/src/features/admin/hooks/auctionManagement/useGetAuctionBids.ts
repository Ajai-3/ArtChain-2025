import { useInfiniteQuery } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";

interface Bid {
  id: string;
  amount: number;
  bidderId: string;
  auctionId: string;
  createdAt: string;
  bidder?: {
    id: string;
    username: string;
    profileImage?: string;
    name?: string;
  };
}

interface BidsResponse {
  message: string;
  data: {
    bids: Bid[];
    total: number;
  };
}

export const useGetAuctionBids = (auctionId: string | null) => {
  return useInfiniteQuery({
    queryKey: ["auction-bids", auctionId],
    queryFn: async ({ pageParam = 1 }) => {
      if (!auctionId) return { bids: [], total: 0 };
      const { data } = await apiClient.get<BidsResponse>(
        `/api/v1/art/bids/${auctionId}`,
        {
          params: {
            page: pageParam,
            limit: 10,
          },
        }
      );
      return data.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const loadedBids = allPages.flatMap((p) => p.bids).length;
      if (loadedBids < lastPage.total) {
        return allPages.length + 1;
      }
      return undefined;
    },
    enabled: !!auctionId,
    initialPageParam: 1,
  });
};
