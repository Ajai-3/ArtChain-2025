import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";

interface GenerateAIImageParams {
  prompt: string;
  negativePrompt?: string;
  resolution: string;
  seed?: number;
  provider?: string;
  model?: string;
  useArtcoins?: boolean;
}

export const useGenerateAIImage = () => {
  return useMutation({
    mutationFn: (data: GenerateAIImageParams) => apiClient.post("/api/v1/art/ai/generate", data),
    onError: (err: any) => {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to generate image");
    },
  });
};
