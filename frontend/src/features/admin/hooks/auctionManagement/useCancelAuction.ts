import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useCancelAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.patch(`/api/v1/art/admin/auctions/${id}/cancel`);
      return response.data;
    },
    onSuccess: (_, id) => {
      queryClient.setQueriesData({ queryKey: ["admin-auctions"] }, (oldData: any) => {
        if (!oldData || !oldData.data || !oldData.data.auctions) return oldData;
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            auctions: oldData.data.auctions.map((auction: any) => {
              if (auction._id === id || auction.id === id) {
                return { ...auction, status: "CANCELLED" };
              }
              return auction;
            }),
          },
        };
      });
      toast.success("Auction cancelled successfully");
    },
    onError: (error: any) => {
      console.error("Failed to cancel auction:", error);
      toast.error(error.response?.data?.message || "Failed to cancel auction");
    },
  });
};
