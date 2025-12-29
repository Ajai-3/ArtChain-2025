import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useBuyArtMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (artId: string) => apiClient.post(`/api/v1/art/buy/${artId}`),
    onSuccess: (data, artId) => {
      toast.success("Art purchased successfully!");
      // Invalidate all related queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ["art"] });
      queryClient.invalidateQueries({ queryKey: ["allArt"] });
      queryClient.invalidateQueries({ queryKey: ["artworks"] });
      queryClient.invalidateQueries({ queryKey: ["userArts"] });
      queryClient.invalidateQueries({ queryKey: ["userGallery"] });
      queryClient.invalidateQueries({ queryKey: ["wallet"] });
    },
    onError: (error: any) => {
      console.error("Buy art failed:", error);
      toast.error(error.response?.data?.message || "Failed to buy art");
    },
  });
};
