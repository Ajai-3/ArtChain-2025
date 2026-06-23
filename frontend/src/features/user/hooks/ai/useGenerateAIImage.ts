import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import toast from "react-hot-toast";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

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
    mutationFn: (data: GenerateAIImageParams) => apiClient.post(API_ENDPOINTS.ART_AI_GENERATE, data),
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { message?: string } } };
      console.error(err);
      toast.error(error?.response?.data?.message || "Failed to generate image");
    },
  });
};
