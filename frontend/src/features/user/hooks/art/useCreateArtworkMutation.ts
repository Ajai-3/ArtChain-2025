import { useMutation } from "@tanstack/react-query";
import apiClient from "../../../../api/axios";
import { toast } from 'react-hot-toast';
import type { CreatePostInput } from "../../../../types/art/CreatePostInput";
import { API_ENDPOINTS } from "../../../../constants/apiEndpoints";

export const useCreateArtworkMutation = () => {
  return useMutation({
    mutationFn: (payload: CreatePostInput) =>
      apiClient.post(API_ENDPOINTS.ART_1, payload),
    onSuccess: (data) => {
      console.log("Artwork created:", data);
      toast.success("Artwork created successfully");
    },
    onError: (error: unknown) => {
      console.error("Artwork creation failed:", error);
    },
  });
};
