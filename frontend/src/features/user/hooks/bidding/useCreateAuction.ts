import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useCreateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
      mutationFn: (data: { hostId?: string; title: string; description: string; imageKey: string; startPrice: number; startDate: string; startTime: string; endDate: string; endTime: string }) => apiClient.post("/api/v1/art/auctions", data),
    onSuccess: () => {
      toast.success("Auction created successfully!");
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || "Failed to create auction");
    },
  });
};
