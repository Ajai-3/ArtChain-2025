import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useCreateAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => apiClient.post("/api/v1/art/auctions", data),
    onSuccess: () => {
      toast.success("Auction created successfully!");
      queryClient.invalidateQueries({ queryKey: ["auctions"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create auction");
    },
  });
};
