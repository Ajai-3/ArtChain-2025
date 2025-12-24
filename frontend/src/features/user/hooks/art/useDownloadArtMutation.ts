import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from "react-hot-toast";

export const useDownloadArtMutation = () => {
  return useMutation({
    mutationFn: (artId: string) => apiClient.get(`/api/v1/art/download/${artId}`),
    onSuccess: (data) => {
      const { downloadUrl } = data.data;
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
    },
    onError: (error: any) => {
      console.error("Download art failed:", error);
      toast.error(error.response?.data?.message || "Failed to download art");
    },
  });
};
