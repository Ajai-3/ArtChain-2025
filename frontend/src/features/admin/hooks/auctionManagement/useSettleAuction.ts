import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useSettleAuction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/api/v1/art/admin/auctions/${id}/settle`);
      return response.data;
    },
    onSuccess: (_, id) => {
      // Refresh the auctions lists for admin
      queryClient.invalidateQueries({ queryKey: ["admin-auctions"] });
      
      toast.success("Auction funds settled successfully");
    },
    onError: (error: any) => {
      console.error("Failed to settle auction:", error);
      toast.error(error.response?.data?.message || "Failed to settle auction");
    },
  });
};
