import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const usePlaceBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ auctionId, amount }: { auctionId: string; amount: number }) =>
      apiClient.post("/api/v1/art/bids", { auctionId, amount }),
    onSuccess: (data, variables) => {
      toast.success("Bid placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["auction", variables.auctionId] });
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to place bid");
    },
  });
};
